import { SignUp } from '@clerk/nextjs';
import Image from "next/image";

export default function Page() {
  return (
  <>
  <div>
    <Image src='/background-taxi-login.png' width={900} height={1000}
    className="object-contain h-full w-full" alt='sign-up'/>
    <div className='absolute top-20 right-20'>
      <SignUp />

    </div>
  </div>
  </>
  )
}