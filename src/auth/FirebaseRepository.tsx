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
            fromFunction: "",
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

        // We need to parse all custom functions used inside the template function
        //const getFunctionLocal = this.getFunction
        let templateBody: any = JSON.parse(funcData.rawJson)
        
        const addedFunctions : Set<string> = new Set()
        // console.log(templateBody)

        // const caller = async () => {
        //     const customFunctions : FunctionData[] = []
        //     await recursivelyFindCustomFunctions(customFunctions, templateBody)
        //     return customFunctions
        // }

        const recursivelyCreateTemplateFunctions : any = async (body: any) => {
            if (body.type == 'custom_function_call') {
                const res = await this.getFunction(body.functionId);
                const srcFunction: string = body.functionId;
                const tmp : FunctionData = {
                    id: "",
                    ownerUid: uid,
                    name: res.name,
                    type: "Template Function",
                    fromTemplate: functionId,
                    fromFunction: srcFunction,
                    rawJson: body.body
                }
                const docRefId : any = await this.createFunction(tmp);
                body.functionId = docRefId;
                // console.log('in custom function call.')
                // console.log(tmp)
                if (!addedFunctions.has(srcFunction)) {
                    //customFunctions.push(tmp)
                    addedFunctions.add(srcFunction);
                }
                // search all inputs to the custom function
                for (const param of body.params) {
                    await recursivelyCreateTemplateFunctions(param)
                }
                //search the body of the custom function
                await recursivelyCreateTemplateFunctions(JSON.parse(body.body))                
                return body
            } else if (body.type == 'input') {
                return body
            } else if (body.type == 'output') {
                // console.log('in output')
                // console.log(body)
                await recursivelyCreateTemplateFunctions(body.params[0])
                return body
            } else if (body.type == 'custom_function') {
                for (const output of body.outputs) {
                    await recursivelyCreateTemplateFunctions(output)
                    return body
                }
            } else if (body.type == 'builtin_function') {
                for (const param of body.params) {
                    await recursivelyCreateTemplateFunctions(param);
                    return body
                }
            } else {
                return body
            }
        }

        templateBody = await recursivelyCreateTemplateFunctions(templateBody);
        console.log(templateBody);

        const templateData : FunctionData = {
            id: "",
            ownerUid: uid,
            name: (funcData as FunctionData).name,
            type: "Template",
            fromTemplate: functionId,
            fromFunction: "",
            rawJson: JSON.stringify(templateBody)
        }

        this.createFunction(templateData);

    }

    async getFunction(functionId: string) {
        const func = await getDoc(doc(this.functionsRef, functionId));
        return func.data() as FunctionData
    }

    async getFunctions() {
        const querySnapshot = await getDocs(this.functionsRef);
        return querySnapshot.docs.map(doc => doc.data())
    }

    subscribeToFunction(functionId: string, callback: (funcData: FunctionData) => void) {
        return onSnapshot(doc(this.functionsRef, functionId), (doc) => {
            callback({...doc.data(), id: doc.id} as FunctionData);
        });
    }

    subscribeToFunctionsForUser(userId: string, callback: (functions: FunctionData[]) => void) {
        const q = query(this.functionsRef, where('ownerUid', '==', userId));
        onSnapshot(q, (snapshot) => {
            callback(snapshot.docs.map(doc => {
                return {...doc.data(), id: doc.id} as FunctionData
            }))
        });
    }

    async getFunctionsForUser(userId: string) {
        const q = query(this.functionsRef, where('ownerUid', '==', userId));
        const qResult = await getDocs(q)
        return qResult.docs.map(e => 
            ({...e.data(), id: e.id} as FunctionData)
        )
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