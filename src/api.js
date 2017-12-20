const LOCAL_BACKEND_URL = 'http://0.0.0.0:8111';
const BACKEND_URL = 'http://35.196.206.248:8111';

module.exports = {
    backendUrl: BACKEND_URL,
    loginUrl: BACKEND_URL + '/login_user',
    signupUrl: BACKEND_URL + '/signup_user',
    updateUserUrl: BACKEND_URL + '/update_user',
    getCityUrl: BACKEND_URL + '/get_city',
    getRecCityUrl: BACKEND_URL + '/get_city_list_by_preference',
    jobByKwUrl: BACKEND_URL + '/search_job_by_kw',
    jobByCityUrl: BACKEND_URL + '/search_job_by_city',
    getJobsUrl: BACKEND_URL + '/get_all_jobs',
    getFavoriteJobsUrl: BACKEND_URL + '/get_favorite_job',
    setFavoriteJobsUrl: BACKEND_URL + '/set_favorite_job'
};