import axios from 'axios';
import { showAlert } from './alert';

export const updateSettings = async (data, type) => {
  //type is either password or data
  try {
    const url =
      type === 'password'
        ? 'https://natours-ganesh.onrender.com/api/v1/users/updateMyPassword'
        : 'https://natours-ganesh.onrender.com/api/v1/users/updateMe';
    const res = await axios({
      method: 'PATCH',
      url,
      data,
    });
    if (res.data.status === 'success') {
      showAlert('success', `${type.toUpperCase()} updated successfully`);
      location.reload();
    }
  } catch (error) {
    showAlert('error', error.response.data.message);
  }
};
