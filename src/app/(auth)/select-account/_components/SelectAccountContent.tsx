import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import SelectAccountForm from "./SelectAccountForm";
import getAccounts from "@/helper/getAccounts";
import getTempSelectAccount from "@/helper/getTempSelectAccount";

const SelectAccountContent = async () => {
  const tempSelectAccount = await getTempSelectAccount();
  const emailId = tempSelectAccount?.emailId;
  const userId = tempSelectAccount?.userId;

  if (!emailId || !userId) {
    return (
      <div className="flex min-h-screen items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Invalid request</CardTitle>
            <CardDescription>
              Missing required user information.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full">
              <a href="/login">Back to login</a>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const accounts = await getAccounts(emailId);

  // If no accounts (should not happen), show a message
  if (accounts.length === 0) {
    return (
      <div className="flex min-h-screen items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>No accounts found</CardTitle>
            <CardDescription>
              This email does not have any associated accounts.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full">
              <a href="/signup">Create an account</a>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <>
      <CardHeader className="text-center">
        <CardTitle className="text-2xl">Choose your profile</CardTitle>
        <CardDescription>
          You have {accounts.length} account{accounts.length > 1 ? "s" : ""}{" "}
          linked to this email. Select one to continue.
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        {accounts.map((account) => (
          <SelectAccountForm
            account={account}
            key={account.id}
            userId={userId}
          />
        ))}
        <div className="pt-2 text-center text-sm text-muted-foreground">
          Not you?{" "}
          <a href="/login" className="text-primary hover:underline">
            Use a different email
          </a>
        </div>
      </CardContent>
    </>
  );
};

export default SelectAccountContent;
