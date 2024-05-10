import {updateDoc, query, where, collection, doc, getDoc, getDocs, setDoc, deleteDoc, addDoc, onSnapshot} from "firebase/firestore";
import {getFirestore} from 'firebase/firestore';
import firebase from "firebase/compat/app";
import Firestore = firebase.firestore.Firestore;

import * as firestore from 'firebase/firestore';
import Timestamp = firestore.Timestamp;

export interface UserData {
    uid: string
    email: string | null
    photoUrl: string | null
    fullName: string | null
}

export interface FunctionData {
    id: string;
    ownerUid: string;
    name: string;
    type: string,
    fromTemplate: string,
    fromFunction: string,
    allowAccess: string[] | string,
    rawJson: string;
}

export interface ShareTemplateMsg {
    id: string,
    senderId: string,
    receiverId: string,
    functionId: string,
    time: Timestamp,
    status: string
}

export interface ModelData {
    id: string;
    name: string;
    description: string;
    inputs: string[];
    displayStyle: string;
}

export interface WorkflowData {
    id: string;
    ownerUid: string;
    name: string;
}

export class FirestoreRepository {
    private readonly db: Firestore;
    private modelsRef;
    private usersRef;
    private functionsRef;
    private workflowsRef;
    private shareFunctionMsgRef;

    constructor(db: Firestore) {
        this.db = db;
        this.modelsRef = collection(db, "Models")
        this.usersRef = collection(db, "Users");
        this.functionsRef = collection(db, "Functions");
        this.workflowsRef = collection(db, "Workflows");
        this.shareFunctionMsgRef = collection(db, "ShareFunctionMessages")
    }

    async createUserIfNotExists(uid: string, email: string | null, photoUrl: string | null, fullName: string | null) {
        const docSnapshot = await getDoc(doc(this.usersRef, uid));
        const userData: UserData = {
            uid: uid,
            email: email,
            photoUrl: photoUrl,
            fullName: fullName
        }

        if (!docSnapshot.exists()) {
            return setDoc(doc(this.usersRef, uid), userData);
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
        console.log(data)
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
            allowAccess: "",
            ownerUid: uid
        }
        const docRef = await addDoc(this.functionsRef, emptyFunctionData);
        return docRef.id;
    }

    async createFunction(funcData: FunctionData) {
        const docRef = await addDoc(this.functionsRef, funcData);
        return docRef.id;
    }

    async grantAccessToFunction(functionId: string, uid: string) {
        const funcRecord = await this.getFunction(functionId)
        const funcBody = funcRecord.rawJson
        const currentPermission = funcRecord.allowAccess
        if (currentPermission == 'all') {

        } else if (currentPermission == "") {
            this.updateFunction(functionId, {allowAccess: [uid]})

        } else { //shared with someone
            if (!currentPermission.includes(uid))  {
                this.updateFunction(functionId, {allowAccess: [...currentPermission, uid]})
            }
        }
    }

    async grantAccessUponShareFunction(functionId: string, uid: string) {
        const funcRecord = await this.getFunction(functionId)
        const funcBody = JSON.parse(funcRecord.rawJson)
        this.grantAccessToFunction(functionId, uid)

        const recursivelyGrantAccess : any = async (body: any) => {
            console.log('in')
            
            if (body.type == 'custom_function_call') {
                console.log('in custom function call')
                this.grantAccessToFunction(body.functionId, uid)
                for (const param of body.params) {
                    await recursivelyGrantAccess(param)
                }
                //search the body of the custom function
                await recursivelyGrantAccess(JSON.parse(body.body))
                return body
            } else if (body.type == 'input') {
                return body
            } else if (body.type == 'output') {
                console.log('in output')
                // console.log('in output')
                // console.log(body)
                await recursivelyGrantAccess(body.params[0])
                return body
            } else if (body.type == 'custom_function') {
                for (const output of body.outputs) {
                    console.log('in custom function')
                    console.log(output)
                    await recursivelyGrantAccess(output)
                }
                return body
            } else if (body.type == 'builtin_function') {
                for (const param of body.params) {
                    await recursivelyGrantAccess(param);
                }
                return body
            } else {
                return body
            }
        }
        recursivelyGrantAccess(funcBody);
    }

    async shareFunction(senderId: string, receiverId: string, functionId: string) {
        //create a message
        this.grantAccessUponShareFunction(functionId, receiverId)

        const msg : ShareTemplateMsg = {
            id: "",
            senderId: senderId,
            receiverId: receiverId,
            functionId: functionId,
            time: Timestamp.now(),
            status: "pending",
        }
        const docRef = await addDoc(this.shareFunctionMsgRef, msg);
        return docRef.id;
    }

    async subscribeToSharedFunctionsForReceiver(receiverId: string, callback: (sharedFunctions: ShareTemplateMsg[]) => void) {
        const q = query(this.shareFunctionMsgRef, where('receiverId', '==', receiverId));
        return onSnapshot(q, (snapshot) => {
            callback(snapshot.docs.map(doc => {
                return {...doc.data(), id: doc.id} as ShareTemplateMsg
            }))
        })
    }

    /**
     * Create a template, which is a copy of the given function f. Also, create template functions from the functions used by f.
     * Note that the fromTemplate field of a 'template' is the original function, 
     * while the fromTemplate field of a 'template function' is the template
     * 
     * Example: 
     * Function foo and function bar are custom functions. Foo uses bar as part of it. 
     * Creating a template from foo results in :
     *      foo_template {
     *          type: Template
     *          fromTemplate: foo
     *      }
     * 
     *      bar_template_function {
     *          type: Template Function
     *          fromTemplate: foo_template
     *          fromFunction: bar
     *      }
     *      
     * @param uid user id
     * @param functionId function to create template from 
     * @returns id of the template created
     */
    async createTemplateFromFunction(uid: string, functionId: string) {

        let funcData: FunctionData = await this.getFunction(functionId);

        // We need to parse all custom functions used inside the template function
        //const getFunctionLocal = this.getFunction
        let templateBody: any = JSON.parse(funcData.rawJson)

        const templateData : FunctionData = {
            id: "",
            ownerUid: uid,
            name: (funcData as FunctionData).name + " template",
            type: "Template",
            fromTemplate: functionId,
            fromFunction: "",
            allowAccess: "",
            rawJson: "{}"
        }

        const templateId = await this.createFunction(templateData);
        
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
                console.log(body)
                console.log(res.rawJson)
                const tmp : FunctionData = {
                    id: "",
                    ownerUid: uid,
                    name: res.name,
                    type: "Template Function",
                    fromTemplate: templateId,
                    fromFunction: srcFunction,
                    allowAccess: "",
                    rawJson: res.rawJson
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
                await recursivelyCreateTemplateFunctions(JSON.parse(res.rawJson))
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
        this.updateFunction(templateId, {rawJson: JSON.stringify(templateBody)})
        return templateId

    }

    async getFunction(functionId: string) {
        const func = await getDoc(doc(this.functionsRef, functionId));
        return func.data() as FunctionData
    }

    /**
     * For security reasons, we need to verify that the function is in the template
     * before returning it back to the user
     * @param templateId 
     * @param functionId 
     */
    async getFunctionInTemplate(templateId: string, functionId: string) {
        //TODO: add verification
        const func = await getDoc(doc(this.functionsRef, functionId));
        return func.data() as FunctionData
    }

    async getFunctions() {
        const querySnapshot = await getDocs(this.functionsRef);
        return querySnapshot.docs.map(doc => doc.data())
    }

    async getShareFunctionMsg(msgId: string) {
        const queryResult = await getDoc(doc(this.shareFunctionMsgRef, msgId));
        return queryResult.data()
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

    subscribeToONLYFunctionsForUser(userId: string, callback: (functions: FunctionData[]) => void) {
        const q = query(this.functionsRef, where('ownerUid', '==', userId), where('type', '==', 'Custom Function'));
        onSnapshot(q, (snapshot) => {
            callback(snapshot.docs.map(doc => {
                return {...doc.data(), id: doc.id} as FunctionData
            }))
        });
    }

    subscribeToTemplatesForUser(userId: string, callback: (functions: FunctionData[]) => void) {
        const q = query(this.functionsRef, where('ownerUid', '==', userId), where('type', '==', 'Template'));
        onSnapshot(q, (snapshot) => {
            callback(snapshot.docs.map(doc => {
                return {...doc.data(), id: doc.id} as FunctionData
            }))
        });
    }

    subscribeToTemplateFunctionsInTemplate(userId: string, templateId: string, callback: (functions: FunctionData[]) => void) {
        const q = query(this.functionsRef, where('ownerUid', '==', userId), 
            where('type', '==', 'Template Function'), 
            where('fromTemplate', '==', templateId)
        );
        console.log('subscribe to template', templateId)
        onSnapshot(q, (snapshot) => {
            callback(snapshot.docs.map(doc => {
                console.log(doc)
                return {...doc.data(), id: doc.id} as FunctionData
            }))
        })
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

    /**
     * Delete the template and all template functions used by it
     * @param templateId 
     */
    async deleteTemplate(uid: string, templateId: string) {
        const q = query(this.functionsRef,
            where('ownerUid', '==', uid),
            where('type', '==', 'Template Function'), 
            where('fromTemplate', '==', templateId)
        );
        getDocs(q).then(qSnapshot => {
            qSnapshot.forEach(qDocSnapshot => {
                deleteDoc(qDocSnapshot.ref)
            })
        })
        return deleteDoc(doc(this.functionsRef, templateId));
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

    async getUserForEmail(email: string): Promise<UserData> {
        const q = query(this.usersRef, where('email', '==', email));
        const response = await getDocs(q);

        const users = response.docs.map(userDocument => {
            return userDocument.data() as UserData
        });

        if(users.length)
            return users[0];

        throw new Error(`No user found for email ${email}`)
    }

    async getUser(uid: string) {
        const user = await getDoc(doc(this.usersRef, uid));
        return user.data() as UserData
    }

    async deleteSharedFunctionMsg(id: string) {
        return deleteDoc(doc(this.shareFunctionMsgRef, id));
    }
}