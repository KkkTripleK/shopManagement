export const UUID_REGEX = new RegExp(
  '[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$',
);
export const PHONE_REGEX = new RegExp('[0-9]{10,11}$');
export const FULLNAME_REGEX = new RegExp('[a-zA-Z ]{2,}$');
