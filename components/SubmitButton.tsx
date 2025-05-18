"use client"

import { Button } from "./ui/button";
import { Loader2 } from "lucide-react";
import { useFormStatus } from "react-dom";

export function SubmitButton({text}:{text:string}) {
const { pending } = useFormStatus();
  return (

    <>
    {pending ? (
        <Button disabled >
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Loading...    
          </Button>
    ):(

        <Button type="submit" className="w-full mt-2" variant="default">
          {text}
        </Button>   
    )}
    
    </>
  );

}

export default function SaveButton(){
    const {pending} = useFormStatus();
    return(
       
    <> {pending?(
        <Button className="w-full mt-2" disabled  size="sm">
          <Loader2 className="mr-2 h-3 w-3 animate-spin" />
          Please wait...    
          </Button>
    ):(
        <Button type="submit" className="w-full mt-2" size="sm">
          Save
        </Button>
    )}
    </>
    );
}