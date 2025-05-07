export const getApiBaseUrl = () => {
  const userAgent = navigator.userAgent || navigator.vendor || window.opera;
  
  if (/android/i.test(userAgent)) {
    return 'http://192.168.43.19:4000';
  }
  return 'http://localhost:8000/api/';
}; 