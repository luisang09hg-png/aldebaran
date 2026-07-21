import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { compare } from "bcryptjs"
import { prisma } from "./prisma"

export const { handlers, signIn, signOut, auth } = NextAuth({ 
  providers: [ 
    Credentials({ 
      credentials: { 
        email: { label: "Email", type: "email" }, 
        password: { label: "Password", type: "password" } 
      }, 
      async authorize(credentials) { 
        if (!credentials?.email || !credentials?.password) return null 

        const user = await prisma.user.findUnique({ 
          where: { email: credentials.email as string } 
        }) 
        if (!user || !user.password) return null 

        const isValid = await compare(credentials.password as string, user.password) 
        if (!isValid) return null 

        return user 
      } 
    }) 
  ], 
  pages: { 
    signIn: "/login", 
  }, 
  callbacks: { 
    async jwt({ token, user }) { 
      if (user) token.id = user.id 
      return token 
    }, 
    async session({ session, token }) { 
      if (token && session.user) { 
        session.user.id = token.id as string 
      } 
      return session 
    } 
  }
})
