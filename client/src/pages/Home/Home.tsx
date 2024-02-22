import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import NavHeader from '../../components/NavHeader.module';
import EchartsCard from '../../components/EchartsCard.module';
import './Home.css';

function Home() {
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
          if (data.code != 0) {
            navigate('/');
          }
        })
        .catch(error => console.error('Error:', error));
    }else{
      navigate('/');
    }
  }, []); 


  return (
    <div className="home-container">
        <NavHeader className="nav-header" />
        <div className="main-content">
          <EchartsCard className="k-stat-card" title='总资产'></EchartsCard>
          <EchartsCard className="k-stat-card" title='A股'></EchartsCard>
        </div>
    </div>
  );
}

export default Home;
