import pandas as pd
import tushare as ts
import numpy as np
from pyxirr import xirr
pro = ts.pro_api()

CATEG_STOCK = 'S'
CATEG_FUND = 'F'
CATEG_CASH = 'C'
OP_BUY = 'B'
OP_SELL = 'S'

FUND_STOCK_HEAD = ('15', '16', '51')
GLOBAL_COUNTER = 1000000

class Account():
    def __init__(self, start_date, end_date):
        self.start_date = pd.to_datetime(start_date, format='%Y%m%d')
        self.end_date = pd.to_datetime(end_date, format='%Y%m%d')
        self.net_quantity = 0
        self.net_amounts = 0
        return

    def update_profit(self):
        df = self.info_df.copy()
        df['quantity'] = 0.0
        df['amounts'] = 0.0
        df['net_values'] = 0.0
        for sec in self.deliv_df.iterrows():
            deliv_info = sec[1]
            if deliv_info.date in df.index:
                df.loc[deliv_info.date, 'amounts'] = df.loc[deliv_info.date].amounts + deliv_info['amounts']
                df.loc[deliv_info.date, 'quantity'] = df.loc[deliv_info.date].quantity + deliv_info['quantity']
            else:
                print(f'Code {self.code} Miss Price Info at {deliv_info.date}')
        df.quantity = df.quantity.cumsum()
        df.amounts = df.amounts.cumsum()
        for sec in df.iterrows():
            df.loc[sec[0], 'net_values']= sec[1].amounts + sec[1].quantity * sec[1].price
        self.profit_df = df[['net_values']]   
    
    def update_trade_date(self):
        trade_date_pd = pro.trade_cal(exchange='', start_date=self.start_date.strftime('%Y%m%d'), end_date=self.end_date.strftime('%Y%m%d'))
        trade_date_pd = trade_date_pd[trade_date_pd.is_open==1].copy()
        trade_date_pd['date'] = trade_date_pd['cal_date']
        trade_date_pd['price'] = 0.0
        trade_date_pd.date = pd.to_datetime(trade_date_pd.date, format='%Y%m%d')
        trade_date_pd.pretrade_date = pd.to_datetime(trade_date_pd.pretrade_date, format='%Y%m%d')
        trade_date_pd = trade_date_pd.sort_values(by='date', ascending=True)
        trade_date_pd = trade_date_pd[['date', 'pretrade_date', 'price']]
        self.trade_date_pd = trade_date_pd
    
    def print_account(self):
        print(self.code)
    
class IntAccount(Account):
    def __init__(self, deliv_path, start_date, end_date):
        super(IntAccount, self).__init__(start_date, end_date)
        self.update_trade_date()
        self.load_delivery(deliv_path)
        self.update_deliv()
        self.update_profit()
    
    def load_delivery(self, _deliv_path):
        df = pd.read_csv(_deliv_path)
        df.date = pd.to_datetime(df.date, format='%Y%m%d')
        self.data = df.sort_values(by='date', ascending=True)
        self.data.amounts = self.data.amounts.astype('float')
        self.sub_accounts = {}
        self.sub_code = []
        indv_sec_df = df[['code','categ']].drop_duplicates()
        for sec in indv_sec_df.iterrows():
            categ = sec[1].categ
            code = sec[1].code
            code_categ = code + '_' + categ
            self.sub_code.append(code_categ)
            if categ == CATEG_FUND:
                self.sub_accounts[code_categ] = FundAccount(self.data, code, self.start_date, self.end_date, self.trade_date_pd)
            elif categ == CATEG_STOCK:
                self.sub_accounts[code_categ] = StockAccount(self.data, code, self.start_date, self.end_date, self.trade_date_pd)
            elif categ == CATEG_CASH:
                self.sub_accounts[code_categ] = CashAccount(self.data, code, self.start_date, self.end_date, self.trade_date_pd)
                
    def update_deliv(self):
        sub_codes = list(self.sub_accounts.keys())
        deliv_df = self.sub_accounts[sub_codes[0]].deliv_df
        for sub_code in sub_codes[1:]:
            sub_acc = self.sub_accounts[sub_code]
            deliv_df = pd.concat([deliv_df, sub_acc.deliv_df])
        self.deliv_df = deliv_df.sort_values(by='date', ascending=True)
    
    def update_profit(self):
        sub_codes = list(self.sub_accounts.keys())
        profit_df = self.sub_accounts[sub_codes[0]].profit_df
        for sub_code in sub_codes[1:]:
            sub_acc = self.sub_accounts[sub_code]
            if sub_acc.categ != CATEG_CASH:
                profit_df = profit_df + sub_acc.profit_df
        self.profit_df = profit_df
        
class StockAccount(Account):
    def __init__(self, deliv_data, code, start_date, end_date, trade_date_pd):
        super(StockAccount, self).__init__(start_date, end_date)
        self.categ = CATEG_STOCK
        self.code = code
        self.deliv_df = deliv_data[(deliv_data['code']== code) & (deliv_data['categ'] == CATEG_STOCK)].copy()
        self.code_name = self.deliv_df.iloc[0]['name']
        self.trade_date_pd = trade_date_pd
        self.update_info()
        self.update_deliv()
        self.update_profit()
        return
    
    def update_info(self):
        if self.code.startswith(FUND_STOCK_HEAD):
            ts_df = pro.fund_nav(ts_code=self.code, start_date=self.start_date.strftime('%Y%m%d'), end_date=self.end_date.strftime('%Y%m%d'))
            ts_df['date']= ts_df['nav_date']
            ts_df['code'] = ts_df['ts_code']
            ts_df['price'] = ts_df['unit_nav']
        else:
            ts_df = ts.pro_bar(ts_code=self.code, adj='bfq', start_date=self.start_date.strftime('%Y%m%d'), end_date=self.end_date.strftime('%Y%m%d'))
            if ts_df['trade_date'] is None:
                print(ts_df)
            ts_df['date'] = ts_df['trade_date']
            ts_df['code'] = ts_df['ts_code']
            ts_df['price'] = ts_df['close']
        ts_df.date = pd.to_datetime(ts_df.date, format='%Y%m%d')
        ts_df = ts_df.drop_duplicates(subset='date')
        ts_df = ts_df.set_index('date')
        info_df = self.trade_date_pd.copy().set_index('date')
        init_row= True
        for sec in info_df.iterrows():
            if init_row:
                init_row = False
                continue
            date = sec[0]
            sec_seris = sec[1]
            if date in ts_df.index:
                info_df.loc[date, 'price'] = ts_df.loc[date, 'price']
            else:
                info_df.loc[date, 'price'] = info_df.loc[sec_seris.pretrade_date, 'price']
        info_df['code'] = self.code
        # info_df = info_df.reset_index()
        self.info_df = info_df
            
    def update_deliv(self):
        stock_quantity = self.deliv_df.quantity.sum()
        if stock_quantity > 0:
            cash_sum = stock_quantity * self.info_df.loc[self.end_date].price
            deliv_column = {
                'date': self.end_date,
                'code': self.code,
                'name': self.code_name,
                'op': 'S',
                'categ': CATEG_STOCK,
                'quantity': -stock_quantity,
                'amounts': cash_sum
            }
            global GLOBAL_COUNTER
            self.deliv_df.loc[GLOBAL_COUNTER] = deliv_column
            GLOBAL_COUNTER -=  1
            self.net_quantity = stock_quantity
            self.net_amounts = cash_sum
        self.net_profits = self.deliv_df.amounts.sum()
        
        
class FundAccount(Account):
    def __init__(self, deliv_data, code, start_date, end_date, trade_date_pd):
        super(FundAccount, self).__init__(start_date, end_date)
        self.categ = CATEG_FUND
        self.code = code
        self.trade_date_pd = trade_date_pd
        self.deliv_df = deliv_data[(deliv_data.code == code) & (deliv_data.categ == CATEG_FUND)].copy()
        self.code_name = self.deliv_df.iloc[0]['name']
        self.update_info()
        self.update_deliv()
        self.update_profit()
        return

    def update_info(self):
        ts_df = pro.fund_nav(ts_code=self.code, start_date=self.start_date.strftime('%Y%m%d'), end_date=self.end_date.strftime('%Y%m%d'))
        ts_df['date']= ts_df['nav_date']
        ts_df['code'] = ts_df['ts_code']
        ts_df['price'] = ts_df['adj_nav']
        ts_df = ts_df.drop_duplicates(subset='date')
        ts_df.date = pd.to_datetime(ts_df.date, format='%Y%m%d')
        ts_df = ts_df.set_index('date')
        info_df = self.trade_date_pd.copy().set_index('date')
        init_row= True
        for sec in info_df.iterrows():
            if init_row:
                init_row = False
                continue
            date = sec[0]
            sec_seris = sec[1]
            if date in ts_df.index:
                info_df.loc[date, 'price'] = ts_df.loc[date, 'price']
            else:
                info_df.loc[date, 'price'] = info_df.loc[sec_seris.pretrade_date, 'price']
        info_df['code'] = self.code
        # info_df = info_df.reset_index()
        self.info_df = info_df
    
    def update_deliv(self):
        last_price = self.info_df.loc[self.end_date].price.astype('float')
        net_quantity = 0
        for sec in self.deliv_df.iterrows():
            idx = sec[0]
            sec_seris = sec[1]
            sec_amounts = sec_seris.amounts
            sec_price = self.info_df.loc[sec_seris.date].price
            sec_buy = sec_seris.op == OP_BUY
            sec_quantity = -sec_amounts / sec_price
            self.deliv_df.loc[idx, 'price'] = sec_price
            self.deliv_df.loc[idx, 'quantity'] = sec_quantity
            net_quantity += sec_quantity.astype('float')
        assert net_quantity >= 0
        if net_quantity > 0:
            cash_sum = net_quantity * last_price
            deliv_column = {
                'date': self.end_date,
                'code': self.code,
                'name': self.code_name,
                'op': 'S',
                'categ': CATEG_FUND,
                'quantity': -net_quantity,
                'amounts': cash_sum
            }
            global GLOBAL_COUNTER
            self.deliv_df.loc[GLOBAL_COUNTER] = deliv_column
            GLOBAL_COUNTER -=  1
            self.net_quantity = net_quantity
            self.net_amounts = cash_sum
        self.net_profits = self.deliv_df.amounts.sum()

        
class CashAccount(Account):
    def __init__(self, deliv_data, code, start_date, end_date, trade_date_pd):
        super(CashAccount, self).__init__(start_date, end_date)
        self.categ = CATEG_CASH
        self.code = code
        self.deliv_df = deliv_data[(deliv_data['code']== code) & (deliv_data['categ'] == CATEG_CASH)].copy()
        self.code_name = self.deliv_df.iloc[0]['name'] 
        self.update_deliv()
        return

    def update_deliv(self):
        cash_amounts = self.deliv_df.amounts.sum()
        if cash_amounts < 0:
            deliv_column = {
                'date': self.end_date,
                'code': self.code,
                'name': self.code_name,
                'op': 'S',
                'categ': CATEG_CASH,
                'quantity': 0,
                'amounts': -cash_amounts
            }
            global GLOBAL_COUNTER
            self.deliv_df.loc[GLOBAL_COUNTER] = deliv_column
            GLOBAL_COUNTER -=  1
            self.net_amounts = -cash_amounts
        self.net_profits = 0
