import {getFromStorage, decryptPrivateKey} from './key'
export function stringDoesNotContainAnyFromArray(str: string): boolean {
    const array: string[] = ["newtab", "localhost"];

    for (let i = 0; i < array.length; i++) {
        if (str.includes(array[i])) {
            return false;
        }
    }
    return true;
}

export async function decryptPrivateKeyFromStorage(password: string): Promise<string> {
    // Retrieve the encrypted private key from storage
    const storageData = await getFromStorage('user');
    const encryptedPrivateKey = storageData.user.encryptedPrivateKey;
    if (encryptedPrivateKey) {
        try {
            const decryptedPrivateKey = await decryptPrivateKey({iv: storageData.user.iv, encryptedPrivateKey: storageData.user.encryptedPrivateKey}, password);
            return decryptedPrivateKey;
        } catch (error) {
            throw new Error('Error decrypting private key: ' + error);
        }
    } else {
        throw new Error('Encrypted private key not found in storage');
    }
}