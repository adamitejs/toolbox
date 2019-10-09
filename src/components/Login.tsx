import * as React from "react";
import { useState } from "react";
import { Button, Dialog, Classes, Intent, FormGroup, InputGroup, Callout } from "@blueprintjs/core";
import adamite from "@adamite/sdk";

type LoginPropTypes = {
  title: string;
  subtitle: string;
  isOpen: boolean;
  onCreateAccountClick?: (e: React.MouseEvent) => void;
  onClose: () => void;
};

function Login({
  title = "Sign in",
  subtitle = "To use this app, sign in with your email and password.",
  isOpen,
  onCreateAccountClick,
  onClose
}: LoginPropTypes) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState();
  const submitDisabled = email === "" || password === "";

  const beginSignIn = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await adamite()
        .auth()
        .loginWithEmailAndPassword(email, password);

      onClose();
    } catch (err) {
      setPassword("");
      setError(err);
      console.error("LoginError", err);
    }
  };

  return (
    <Dialog icon="lock" title={title} isOpen={isOpen} style={{ maxWidth: 360 }} onClose={onClose}>
      <form onSubmit={beginSignIn}>
        <div className={Classes.DIALOG_HEADER}>
          <p>{subtitle}</p>
        </div>

        <div className={Classes.DIALOG_BODY}>
          {error && (
            <Callout title={error} intent={Intent.DANGER} style={{ marginBottom: 10 }}>
              Please check your sign in details and try again.
            </Callout>
          )}

          <FormGroup label="Email" labelInfo="(required)">
            <InputGroup
              type="email"
              name="email"
              placeholder="you@gmail.com"
              value={email}
              onChange={(e: React.FormEvent<HTMLInputElement>) => setEmail(e.currentTarget.value)}
              large
            />
          </FormGroup>

          <FormGroup
            label="Password"
            labelInfo="(required)"
            helperText={<a href="javascript:void(0)">Forgot your password?</a>}
          >
            <InputGroup
              type="password"
              name="password"
              placeholder="Password"
              large
              value={password}
              onChange={(e: React.FormEvent<HTMLInputElement>) => setPassword(e.currentTarget.value)}
            />
          </FormGroup>
        </div>

        <div className={Classes.DIALOG_FOOTER}>
          <div className={Classes.DIALOG_FOOTER_ACTIONS}>
            {onCreateAccountClick && (
              <Button type="button" text="Create an Account" onClick={onCreateAccountClick} minimal />
            )}
            <Button type="submit" intent={Intent.PRIMARY} text="Sign In" disabled={submitDisabled} />
          </div>
        </div>
      </form>
    </Dialog>
  );
}

export default Login;
