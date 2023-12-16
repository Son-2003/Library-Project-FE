import { Redirect } from "react-router-dom";
import { useOktaAuth } from "@okta/okta-react"; 
import SpinnerLoading from "../Layouts/Utils/SpinnerLoading";
import OktaSignInWidget from "./OktaSignInWidget";

const LoginWidget = ({config}) => {
    const {oktaAuth, authState} = useOktaAuth();
    const onScuccess = tokens => {
        oktaAuth.handleLoginRedirect(tokens);
    }

    const onError = (err) => {
        console.log("Sign in error: " + err);
    }

    if(!authState){
        return <SpinnerLoading/>
    }

    return authState.isAuthenticated ? 
    <Redirect to={{pathname: "/"}}/> :
    <OktaSignInWidget config={config} onError = {onError} onScuccess = {onScuccess}/>
};

export default LoginWidget