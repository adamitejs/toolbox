import * as React from "react";
import { useState } from "react";
import { Button, Dialog, Classes, Intent, FormGroup, InputGroup, Callout } from "@blueprintjs/core";
import adamite, { AuthUser, DatabaseServerValue } from "@adamite/sdk";

type RegisterPropTypes = {
  title: string;
  subtitle: string;
  isOpen: boolean;
  onSignInClick?: (e: React.MouseEvent) => void;
  onClose: () => void;
};

function Register({
  title = "Sign up",
  subtitle = "To use this app, create an account.",
  isOpen,
  onSignInClick,
  onClose
}: RegisterPropTypes) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState();
  const submitDisabled = name == "" || email === "" || password === "";

  const beginCreateAccount = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const auth = adamite().auth();
      const database = adamite().database();

      await auth.createUser(email, password, async (authState: AuthUser | undefined) => {
        if (!authState) return;

        database.collection("users").create({
          id: authState.id,
          email,
          name,
          createdAt: DatabaseServerValue.timestamp,
          updatedAt: DatabaseServerValue.timestamp
        });

        onClose();
      });
    } catch (err) {
      setError(err);
      console.error("RegisterError", err);
    }
  };

  return (
    <Dialog icon="lock" title={title} isOpen={isOpen} style={{ maxWidth: 360 }} onClose={onClose}>
      <form onSubmit={beginCreateAccount}>
        <div className={Classes.DIALOG_HEADER}>
          <p>{subtitle}</p>
        </div>

        <div className={Classes.DIALOG_BODY}>
          {error && (
            <Callout title={error} intent={Intent.DANGER} style={{ marginBottom: 10 }}>
              Please check your account details and try again.
            </Callout>
          )}

          <FormGroup label="Name" labelInfo="(required)">
            <InputGroup
              type="text"
              name="name"
              autoCapitalize="words"
              placeholder="Your Name"
              value={name}
              onChange={(e: React.FormEvent<HTMLInputElement>) => setName(e.currentTarget.value)}
              large
            />
          </FormGroup>

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

          <FormGroup label="Password" labelInfo="(required)">
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
            {onSignInClick && <Button type="button" text="Sign In" onClick={onSignInClick} minimal />}
            <Button type="submit" intent={Intent.PRIMARY} text="Create an Account" disabled={submitDisabled} />
          </div>
        </div>
      </form>
    </Dialog>
  );
}

export default Register;
