import { Client, Account, Databases} from 'appwrite';

const client = new Client();
const databases = new Databases(client);
const account = new Account(client);

client
    .setEndpoint(import.meta.env.VITE_APPRITE_ENDPOINT)
    .setProject(import.meta.env.VITE_PROJECT_ID);

const collections = [
    {
        name: "noteDb",
        id: import.meta.env.VITE_NOTE_COLLECTION_ID,
        dbId: import.meta.env.VITE_NOTES_DB_ID,
    }
]

export { ID } from 'appwrite';
export {collections, account, databases};
