import { z } from "zod";

export const PASSWORD_MIN_LENGTH = 4;
export const PASSWORD_REGEX = new RegExp(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*?[#?!@$%^&*-]).+$/
);
export const PASSWORD_REGEX_ERROR =
    "Passwords must contain at least one UPPERCASE, lowercase, number and special characters #?!@$%^&*-";

export const MB = 1048576;
export const PLZ_ADD_PHOTO = '사진을 추가해주세요.';