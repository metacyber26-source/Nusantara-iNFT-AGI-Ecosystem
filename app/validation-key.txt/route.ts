import { NextResponse } from "next/server"

export async function GET() {
  const validationKey = "e67015aecd9b568df08388c6bceff0ad293f3623a059ca72ac73e8990b77601a2ce7722dfc7d872ac977f95bceec0ec2b5f2fc56499ab591f879c276dd4c3871"
  
  return new NextResponse(validationKey, {
    headers: {
      "Content-Type": "text/plain",
    },
  })
}
