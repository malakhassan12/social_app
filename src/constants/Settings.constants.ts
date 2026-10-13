import { AccountType } from "@/generated/prisma/enums";

const ACCOUNT_TYPES = [
  {
    value: AccountType.PRIVATE,
    label: "Private",
  },
  {
    value: AccountType.PUBLIC,
    label: "Public",
  },
];


const COUNTRIES = [
  { value: "EG", label: "Egypt" },
  { value: "US", label: "United States" },
  { value: "UK", label: "United Kingdom" },
  { value: "DE", label: "Germany" },
  { value: "FR", label: "France" },
];


export { ACCOUNT_TYPES , COUNTRIES };
