import Link from "next/link";

export default function Home() {
    return (
      <div>
        <div className="flex items-center flex-col mt-[220px] bg-white">
          <p className="text-[24px] font-bold text-black">Welcome!</p>
          <p className="text-[12px] text-black">Create to your account</p>
        </div>
        <div className="flex flex-col items-center bg-white">
          <label className="text-xs text-gray-400 bg-white rounded-[50px] pl-5 pt-2 mt-5 w-[330px] h-[35px] shadow-[0_4px_4px_rgba(0,0,0,0.25)]">
            Email:
            <input type="email" name="email" required />
          </label>
          <label className="text-xs text-gray-400 bg-white rounded-[50px] pl-5 pt-2 mt-5 w-[330px] h-[35px] shadow-[0_4px_4px_rgba(0,0,0,0.25)]">
            Password:
            <input type="password" name="password" required minLength={6} />
          </label>
          <button className="mt-12 w-[270px] h-[40px] bg-[#FFA07A] rounded-[20px] text-sm text-white">
            Login
          </button>
        </div>
        <div className="flex mt-8 flex mt-6 justify-center">
            <p className="text-xs text-black">Don't have an account</p>
            <Link href="/" className="text-xs text-[#FFA07A] pl-2 ">Sign up here</Link>
          </div>
      </div>
    );
  }
  
  