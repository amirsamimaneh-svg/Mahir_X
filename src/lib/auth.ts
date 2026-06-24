export type UserRole = "user" | "admin";

export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  role: UserRole;
  approved: boolean;
  createdAt: string;
}

export function getUsers(): User[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem("mahirx_users") || "[]");
  } catch { return []; }
}

export function saveUsers(users: User[]) {
  localStorage.setItem("mahirx_users", JSON.stringify(users));
}

export function getCurrentUser(): User | null {
  if (typeof window === "undefined") return null;
  try {
    const data = localStorage.getItem("mahirx_current_user");
    return data ? JSON.parse(data) : null;
  } catch { return null; }
}

export function setCurrentUser(user: User | null) {
  if (user) {
    localStorage.setItem("mahirx_current_user", JSON.stringify(user));
  } else {
    localStorage.removeItem("mahirx_current_user");
  }
}

export function register(name: string, email: string, password: string): { ok: boolean; error?: string } {
  const users = getUsers();
  if (users.find(u => u.email === email)) {
    return { ok: false, error: "این ایمیل قبلاً ثبت شده / Email already exists" };
  }
  const isFirst = users.length === 0;
  const newUser: User = {
    id: Date.now().toString(),
    name, email, password,
    role: isFirst ? "admin" : "user",
    approved: isFirst,
    createdAt: new Date().toISOString(),
  };
  users.push(newUser);
  saveUsers(users);
  if (isFirst) setCurrentUser(newUser);
  return { ok: true };
}

export function login(email: string, password: string): { ok: boolean; user?: User; error?: string } {
  const users = getUsers();
  const user = users.find(u => u.email === email && u.password === password);
  if (!user) return { ok: false, error: "ایمیل یا رمز اشتباه است / Invalid credentials" };
  if (!user.approved) return { ok: false, error: "حساب شما هنوز تأیید نشده / Account not approved yet" };
  setCurrentUser(user);
  return { ok: true, user };
}

export function logout() {
  setCurrentUser(null);
}

export function approveUser(userId: string) {
  const users = getUsers();
  const idx = users.findIndex(u => u.id === userId);
  if (idx !== -1) {
    users[idx].approved = true;
    saveUsers(users);
  }
}

export function setUserRole(userId: string, role: UserRole) {
  const users = getUsers();
  const idx = users.findIndex(u => u.id === userId);
  if (idx !== -1) {
    users[idx].role = role;
    saveUsers(users);
  }
}
