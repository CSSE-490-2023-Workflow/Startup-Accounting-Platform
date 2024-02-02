import {updateDoc, query, where, collection, doc, getDoc, getDocs, setDoc, deleteDoc, addDoc, onSnapshot} from "firebase/firestore";
import {getFirestore} from 'firebase/firestore';
import firebase from "firebase/compat/app";
import "firebase/compat/firestore";
import Firestore = firebase.firestore.Firestore;
import { ModelData } from "../pages/Models/Models";
import { FunctionData } from "../pages/Functions/Functions";
import { FirestoreDataConverter, QueryDocumentSnapshot, SnapshotOptions, DocumentData } from "firebase/firestore";
import {WorkflowData} from "../pages/Workflow/Workflows";

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
    private functionsRef;
    private workflowsRef;

    constructor(db: Firestore) {
        this.db = db;
        this.modelsRef = collection(db, "Models").withConverter(modelConverter);
        this.usersRef = collection(db, "Users");
        this.functionsRef = collection(db, "Functions");
        this.workflowsRef = collection(db, "Workflows");
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

    async updateFunction(functionId: string, data: object) {
        return updateDoc(doc(this.functionsRef, functionId), data);
    }

    async getFunctions() {
        const querySnapshot = await getDocs(this.functionsRef);
        return querySnapshot.docs.map(doc => doc.data())
    }

    async createEmptyFunction(uid: string) {
        const emptyFunctionData: FunctionData = {
            rawJson: "{}",
            id: "",
            name: "New Function",
            ownerUid: uid
        }
        const docRef = await addDoc(this.functionsRef, emptyFunctionData);
        return docRef.id;
    }

    async getFunction(functionId: string) {
        const func = await getDoc(doc(this.functionsRef, functionId));
        return func.data() as FunctionData
    }

    subscribeToFunction(functionId: string, callback: (funcData: FunctionData) => void) {
        return onSnapshot(doc(this.functionsRef, functionId), (doc) => {
            callback({...doc.data(), id: doc.id} as FunctionData);
        });
    }

    subscribeToFunctionsForUser(userId: string, callback: (functions: FunctionData[]) => void) {
        const q = query(this.functionsRef, where('ownerUid', '==', userId));
        return onSnapshot(q, (snapshot) => {
            callback(snapshot.docs.map(doc => {
                return {...doc.data(), id: doc.id} as FunctionData
            }))
        });
    }

    async deleteFunction(id: string) {
        return deleteDoc(doc(this.functionsRef, id));
    }

    subscribeToWorkflowsForUser(userId: string, callback: (workflows: WorkflowData[]) => void) {
        const q = query(this.workflowsRef, where('ownerUid', '==', userId));
        return onSnapshot(q, (snapshot) => {
            callback(snapshot.docs.map(doc => {
                return {...doc.data(), id: doc.id} as WorkflowData
            }))
        })
    }

    async createEmptyWorkflow(uid: string) {
        const emptyWorkflowData: WorkflowData = {
            id: "",
            name: "New Workflow",
            ownerUid: uid
        }
        const docRef = await addDoc(this.workflowsRef, emptyWorkflowData);
        return docRef.id;
    }

    async deleteWorkflow(id: string) {
        return deleteDoc(doc(this.workflowsRef, id));
    }

    subscribeToWorkflow(workflowId: string, callback: (workflowData: WorkflowData) => void) {
        return onSnapshot(doc(this.workflowsRef, workflowId), (doc) => {
            callback({...doc.data(), id: doc.id} as WorkflowData);
        });
    }

    async updateWorkflow(workflowId: string, data: object) {
        return updateDoc(doc(this.workflowsRef, workflowId), data);
    }
}