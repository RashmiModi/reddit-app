
import { Textarea } from "./ui/textarea"
import { updateCommunityDescription } from "@/app/action"
import SaveButton from "./SubmitButton"
import { useActionState } from "react";
import {  useEffect } from "react";


import {  toast } from 'react-toastify';
interface iAppProps {
    subName: string;
    description: string | null|undefined;
}

const intialState={
   message:"",
   status:"",
}
export function SubDescriptionForm({subName, description}: iAppProps) {
   const [state,formAction]=useActionState(updateCommunityDescription,intialState)
   useEffect(() => {
    if (state.status === 'green') {
      toast.success(state.message);
    } else if (state.status === 'red') {
      toast.error(state.message);
    }
  }, [state]);
   return(
        <form className="mt-3" action={formAction}>
            <input type="hidden" name="id" value={subName} />
            <Textarea name="description" placeholder="custom description"
            defaultValue={description??undefined}  />
            <SaveButton />
          </form>
    )
} 