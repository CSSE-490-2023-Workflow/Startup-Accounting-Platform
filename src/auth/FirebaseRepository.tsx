import {updateDoc, query, where, collection, doc, getDoc, getDocs, setDoc, deleteDoc, addDoc, onSnapshot} from "firebase/firestore";
import {getFirestore} from 'firebase/firestore';
import firebase from "firebase/compat/app";
import "firebase/compat/firestore";
import Firestore = firebase.firestore.Firestore;
import { ModelData } from "../pages/Models/Models";
import { FunctionData, ShareTemplateMsg } from "../pages/Functions/Functions";
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
    private shareFunctionMsgRef;

    constructor(db: Firestore) {
        this.db = db;
        this.modelsRef = collection(db, "Models").withConverter(modelConverter);
        this.usersRef = collection(db, "Users");
        this.functionsRef = collection(db, "Functions");
        this.workflowsRef = collection(db, "Workflows");
        this.shareFunctionMsgRef = collection(db, "ShareFunctionMessages")
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

    async createEmptyFunction(uid: string) {
        const emptyFunctionData: FunctionData = {
            rawJson: "{}",
            id: "",
            name: "New Function",
            type: "Custom Function",
            fromTemplate: "",
            ownerUid: uid
        }
        const docRef = await addDoc(this.functionsRef, emptyFunctionData);
        return docRef.id;
    }

    async createFunction(funcData: FunctionData) {
        const docRef = await addDoc(this.functionsRef, funcData);
        return docRef.id;
    }

    async shareFunction(senderId: string, receiverId: string, functionId: string) {
        //create a message
        const msg : ShareTemplateMsg = {
            senderId: senderId,
            receiverId: receiverId,
            functionId: functionId,
            time: (firebase.firestore.FieldValue.serverTimestamp() as firebase.firestore.Timestamp),
            status: "pending",
        }
        const docRef = await addDoc(this.shareFunctionMsgRef, msg);
        return docRef.id;
    }

    async createTemplateFromFunction(uid: string, functionId: string) {
        
        let funcData: FunctionData = await this.getFunction(functionId)

        const templateData : FunctionData = {
            id: "",
            ownerUid: uid,
            name: (funcData as FunctionData).name,
            type: "Template",
            fromTemplate: functionId,
            rawJson: (funcData as FunctionData).rawJson
        }

        // We need to parse all custom functions used inside the template function
        //const getFunctionLocal = this.getFunction
        const templateBody: any = JSON.parse(templateData.rawJson)
        const customFunctions : FunctionData[] = []
        
        const addedFunctions : Set<string> = new Set()
        console.log(templateBody)

        const recursivelyFindCustomFunctions : any = async (customFunctions: FunctionData[], body: any) => {
            if (body.type == 'custom_function_call') {
                const res = await this.getFunction(body.functionId);
                const tmp : FunctionData = {
                    id: "",
                    ownerUid: uid,
                    name: res.name,
                    type: "Template Function",
                    fromTemplate: functionId,
                    rawJson: body.body
                }
                // console.log('in custom function call.')
                // console.log(tmp)
                if (!addedFunctions.has(body.functionId)) {
                    customFunctions.push(tmp)
                    addedFunctions.add(body.functionId);
                }
                // search all inputs to the custom function
                for (const param of body.params) {
                    await recursivelyFindCustomFunctions(customFunctions, param)
                }
                //search the body of the custom function
                await recursivelyFindCustomFunctions(customFunctions, JSON.parse(body.body))                
            } else if (body.type == 'input') {
                //
            } else if (body.type == 'output') {
                // console.log('in output')
                // console.log(body)
                await recursivelyFindCustomFunctions(customFunctions, body.params[0])
            } else if (body.type == 'custom_function') {
                for (const output of body.outputs) {
                    await recursivelyFindCustomFunctions(customFunctions, output)
                }
            } else if (body.type == 'builtin_function') {
                for (const param of body.params) {
                    await recursivelyFindCustomFunctions(customFunctions, param);
                }
            }
        }

        await recursivelyFindCustomFunctions(customFunctions, templateBody);
        console.log(customFunctions);

        for (const customFunction of customFunctions) {
            this.createFunction(customFunction);
        }

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