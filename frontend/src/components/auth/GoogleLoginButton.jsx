import { GoogleLogin } from "@react-oauth/google";

const GoogleLoginButton = ({ onSuccess, onError, text = "continue_with" }) => {
  const handleSuccess = (credentialResponse) => {
    if (credentialResponse?.credential) {
      onSuccess(credentialResponse.credential);
    } else {
      if (onError) onError("Google Authentication failed: No ID token returned.");
    }
  };

  const handleError = () => {
    if (onError) {
      onError("Google Sign-In failed or was closed.");
    }
  };

  return (
    <div className="w-full flex justify-center items-center my-2 google-btn-container">
      <GoogleLogin
        onSuccess={handleSuccess}
        onError={handleError}
        text={text}
        theme="outline"
        size="large"
        shape="rectangular"
        logo_alignment="center"
        width="100%"
      />
    </div>
  );
};

export default GoogleLoginButton;
