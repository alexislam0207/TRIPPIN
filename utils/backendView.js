import {
  createAccount,
  logIn,
  logOut,
  removeUser,
  signedInUser,
} from "./controllers/authentication";
import {
  getHolidays,
  getHoliday,
  postHoliday,
  patchHoliday,
  deleteHoliday,
} from "./controllers/backendHolidays";
import { deleteMemory, getMemories, getMemory, patchMemory, postMemory } from "./controllers/backendMemories";
import { getUserByName, getUsers, patchUser } from "./controllers/backendUsers";
import { createShareLink, deleteShareLink, getSharedLink } from "./controllers/shareLink";

// user authentication
export const createUser = async (email, pass, username) => await createAccount(email, pass, username);
export const userLogIn = async (email, pass) => await logIn(email, pass);
export const userLogOut = async () => await logOut();
export const deleteAccount = async () => await removeUser();
export const userCheck = async (bool) => await signedInUser(bool)

// users collection
export const allUsers = async () => await getUsers();
export const getUserInfo = async (username) => await getUserByName(username);
export const editUserInfo = async (userId, field, input) => await patchUser(userId, field, input);

// :user/holidays collection
export const holidaysByUser = async (userId) => await getHolidays(userId);
export const holidayById = async (userId, holidayId) => await getHoliday(userId, holidayId);
export const addHoliday = async (userId, title, location) => await postHoliday(userId, title, location);
export const editHoliday = async (userId, holidayId, field, input) => await patchHoliday(userId, holidayId, field, input);
export const removeHoliday = async (userId, holidayId) => await deleteHoliday(userId, holidayId)

// :user/:holiday/memories collection
export const memoriesByHoliday = async (userId, holidayId) => await getMemories(userId, holidayId);
export const memoryById = async (userId, holidayId, memoryId) => await getMemory(userId, holidayId, memoryId);
export const addMemory = async (userId, holidayId, title, location) => await postMemory(userId, holidayId, title, location);
export const editMemory = async (userId, holidayId, memoryId, field, input) => await patchMemory(userId, holidayId, memoryId, field, input);
export const removeMemory = async (userId, holidayId, memoryId) => await deleteMemory(userId, holidayId, memoryId);

// share holidays
export const addLinkToHoliday = async (userId, holidayId) => await createShareLink(userId, holidayId);
export const removeLinkFromHoliday = async (userId, holidayId) => await deleteShareLink(userId, holidayId);
export const useLinkToHoliday = async (link) => await getSharedLink(link);

