import { apiRequest } from './../../background/utils/api'

interface createResponse {
    password: string;
    token: string;
  }
  
  export function createUserAndStoreCredentials(): Promise<void> {
    return new Promise((resolve, reject) => {
      chrome.storage.local.get('user', (result) => {
        const userData = result.user;
        if (userData && userData.id) {
          const address = userData.id;
  
          apiRequest('POST', 'user/create-user', { address: address })
            .then((response: unknown) => {
              const { password, token } = response as createResponse;
  
              userData.password = password;
              userData.token = token;
  
              chrome.storage.local.set({ user: userData }, () => {
                console.log('Password and token have been saved to local storage.');
                resolve();
              });
            })
            .catch((error) => {
              console.error('Error creating user:', error);
              reject(error);
            });
        } else {
          console.error('Address not found in local storage.');
          reject(new Error('Address not found in local storage.'));
        }
      });
    });
  }
  