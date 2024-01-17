import {collection, doc, getDoc, getDocs, setDoc, deleteDoc} from "firebase/firestore";
import {getFirestore} from 'firebase/firestore';
import firebase from "firebase/compat/app";
import "firebase/compat/firestore";
import Firestore = firebase.firestore.Firestore;
import { ModelData } from "../pages/Models/Models";
import { FirestoreDataConverter, QueryDocumentSnapshot, SnapshotOptions, DocumentData } from "firebase/firestore";


const modelConverter: FirestoreDataConverter<ModelData> = {
    toFirestore(model: ModelData): DocumentData {
        return model;
    },
    fromFirestore(snapshot: QueryDocumentSnapshot, options: SnapshotOptions): ModelData {
        const data = snapshot.data(options)!;
        return {
            id: snapshot.id,
            name: data.name,
            description: data.description,
            inputs: data.inputs,
            displayStyle: data.displayStyle
        };
    }
};

export class FirestoreRepository {
    private readonly db: Firestore;
    private modelsRef;
    private usersRef;

    constructor(db: Firestore) {
        this.db = db;
        // @ts-ignore
        this.modelsRef = collection(db, "Models").withConverter(modelConverter);
        // @ts-ignore
        this.usersRef = collection(db, "Users");
    }

    async createUserIfNotExists(uid: string, email: string | null | undefined, photoUrl: string | null | undefined) {
        // @ts-ignore
        const docSnapshot = await getDoc(doc(this.usersRef, uid));
        if (!docSnapshot.exists()) {
            return setDoc(doc(this.usersRef, uid), {
                uid: uid,
                email: email,
                photoUrl: photoUrl
            });
        }
    }

    async getModels() {
        const querySnapshot = await getDocs(this.modelsRef);
        return querySnapshot.docs.map(doc => doc.data() as ModelData)
    }

    async updateModel(modelData: ModelData) {
        return setDoc(doc(this.modelsRef, modelData.id), modelData);
    }

    async deleteModel(modelData: ModelData) {
        return deleteDoc(doc(this.modelsRef, modelData.id));
    }
}