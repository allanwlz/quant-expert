import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Modal } from 'antd';
import loginIcon from '../../assets/qe-icon.svg';
import './LoginForm.css';


function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    // 检查localStorage中是否有token
    const jwtToken = localStorage.getItem('jwtToken');
    if (jwtToken) {
      fetch('http://192.168.101.2:3000/validate-token', {
        method: 'GET',
        headers: {
          'x-jwt-token': `${jwtToken}` // 将token放在请求头中
        }
      })
        .then(response => response.json())
        .then(data => {
          if (data.code == 0) {
            navigate('/home');
          }
        })
        .catch(error => console.error('Error:', error));
    }
  }, []); // 依赖项数组中包含navigate，以确保如果navigate改变，effect能够重新运行

  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(e.currentTarget.value);
  }

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.currentTarget.value);
  };

  const handleSubmit = async (e: React.ChangeEvent<HTMLFormElement>) => {
    e.preventDefault(); // 阻止表单默认的提交行为

    // 创建登录信息对象
    const signInDto = {
      username,
      password,
    };

    try {
      // 发送POST请求到你的API端点
      const response = await axios.post('http://192.168.101.2:3000/sign-in', signInDto);
      if (response.data.code == -1) {
        throw new Error(response.data.msg);
      }
      const jwtToken = response.data.data;
      localStorage.setItem('jwtToken', jwtToken);
      navigate('/home');
    } catch (error: any) {
      // 处理错误，比如显示错误消息
      setErrorMessage(error.message);
      setIsModalVisible(true);
    }
  };

  const handleOk = () => {
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };


  return (
    <div className="login-container">
      <div className="login-header">
        <img src={loginIcon} alt="Icon" className="login-icon" />
        <span className="login-title">Login</span>
      </div>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <input
            type="username"
            id="username"
            placeholder='Username'
            value={username}
            onChange={handleUsernameChange}
            required
          />
        </div>
        <div className="form-group">
          <input
            type="password"
            id="password"
            value={password}
            placeholder='Password'
            onChange={handlePasswordChange}
            required
          />
        </div>
        <button type="submit" className="login-button">Login</button>
      </form>
      <Modal title="登录失败" open={isModalVisible} onOk={handleOk} onCancel={handleCancel}>
        <p>{errorMessage}</p>
      </Modal>
    </div>
  );
}

export default Login;
