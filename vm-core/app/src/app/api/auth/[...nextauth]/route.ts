import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { randomUUID, randomBytes } from "crypto";

const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Admin",
      credentials: {
        id: {
          label: "Id",
          type: "text",
        },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        // credentials に入力が渡ってくる
        // id, password はここでベタ打ちして検証している
        const matched = credentials?.id === "id123" && credentials?.password === "pw123";

        if (matched) {
          // 今回は null を返さなければなんでもよいので適当
          return {
            id: "29472084752894723890248902",
          };
        } else {
          return null;
        }
      },
    }),
  ],
  pages: {
    signIn: "/login",
  },
  secret: process.env.SECRET,
  jwt: {
    maxAge: 3 * 24 * 60 * 60, // 3 days
  },
  session: {
    maxAge: 3 * 24 * 60 * 60, // 3 days
    updateAge: 24 * 60 * 60, // 24 hours
    generateSessionToken: () => {
      return randomUUID?.() ?? randomBytes(32).toString("hex");
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
