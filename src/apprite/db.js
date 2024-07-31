import { ID, databases, collections } from "../lib/apprite";

const db = {};

collections.forEach((collection) => {
  db[collection.name] = {
    create: async({ content, title, position }, id = ID.unique()) => {
      return await databases.createDocument(
        collection.dbId,
        collection.id,
        id,
        { 
          title: title,
          content: content,
          position: position 
        }
      );
    },
    update: async (id, { content, title, position }) => {
      return await databases.updateDocument(
        collection.dbId,
        collection.id,
        id,
        { 
          title: title,
          content: content,
          position: position 
        }
      );
    },
    getAll: async () => {
      return await databases.listDocuments(
        collection.dbId,
        collection.id
      );
    },
    getOne: async (id) => {
      return await databases.getDocument(
        collection.dbId,
        collection.id,
        id
      );
    },
    deleteOne: async (id) => {
      return await databases.deleteDocument(
        collection.dbId,
        collection.id,
        id
      );
    },
    deleteAll: async () => {
      // This might not be valid as there's no method to delete all documents in Appwrite directly
      return await databases.listDocuments(
        collection.dbId,
        collection.id
      ).then(documents => {
        return Promise.all(documents.map(doc => 
          databases.deleteDocument(
            collection.dbId,
            collection.id,
            doc.$id
          )
        ));
      });
    },
  }
});

export { db };
