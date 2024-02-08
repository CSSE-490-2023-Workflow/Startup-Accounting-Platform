import { useParams } from 'react-router-dom';
import Toolbar from "../../Components/Toolbar/Toolbar";
import Workspace from "../../Components/Workspace/Workspace";
import FuncBuilderPreview from "../../Components/FunctionBuilder/FunctionBuilderPreview";
import {LoadingOverlay, TextInput} from "@mantine/core";
import {useEffect, useRef, useState} from "react";
import {database} from "../../auth/firebase";
import {FunctionData} from "../../auth/FirebaseRepository";
import { QuerySnapshot } from 'firebase/firestore';

function FunctionPreview() {
    const templateId = useParams().id;
    const shareMsgId = useParams().shareMsgId;
    const [functionData, setFunctionData] = useState<FunctionData>();
    const verified = useRef<boolean>(false)

    database.getShareFunctionMsg(shareMsgId as string).then(res => {
      //console.log('res', res)
      if (res !== undefined) {
        verified.current = true
      }
    })

    useEffect(() => {
        if(templateId) {
            database.subscribeToFunction(templateId, (functionDataFromDB: FunctionData) => {
               setFunctionData(functionDataFromDB);
            });
        }
    }, [templateId]);

    if(!templateId || !functionData) {
        return <LoadingOverlay />
    }

    const doc = verified.current ? (
      <>
          <Toolbar>
              <TextInput defaultValue={functionData.name} disabled={true}/>
              <FuncBuilderPreview templateId={templateId} functionRawJson={functionData.rawJson} />
          </Toolbar>
          <Workspace>
              {/*<h6>Function data: {functionData.rawJson}</h6>*/}
          </Workspace>
      </>
    ) : (<a>Bad request</a>)
    console.log(doc);

    return doc;
}

export default FunctionPreview;
