import Link from "next/link";

export default function Home() {
  return (
    <div>
      <div className="flex items-center flex-col mt-[220px] bg-white">
        <p className="text-[24px] font-bold text-black">Welcome!</p>
        <p className="text-[12px] text-black">Create to your account</p>
      </div>
      <form className="flex flex-col items-center bg-white">
        <label className="text-xs text-gray-400 bg-white rounded-[50px] pl-5 pt-2 mt-5 w-[330px] h-[35px] shadow-[0_4px_4px_rgba(0,0,0,0.25)]">
          Full name:
          <input type="text" name="username" required />
        </label>
        <label className="text-xs text-gray-400 bg-white rounded-[50px] pl-5 pt-2 mt-5 w-[330px] h-[35px] shadow-[0_4px_4px_rgba(0,0,0,0.25)]">
          Email:
          <input type="email" name="email" required />
        </label>
        <label className="text-xs text-gray-400 bg-white rounded-[50px] pl-5 pt-2 mt-5 w-[330px] h-[35px] shadow-[0_4px_4px_rgba(0,0,0,0.25)]">
          Password:
          <input type="password" name="password" required minLength={6} />
        </label>
        <label className="text-xs text-gray-400 bg-white rounded-[50px] pl-5 pt-2 mt-5 w-[330px] h-[35px] shadow-[0_4px_4px_rgba(0,0,0,0.25)]">
          Confirm password:
          <input type="password" name="password2" required minLength={6} />
        </label>
        <label className="text-xs text-gray-400 bg-white rounded-[50px] pl-5 pt-2 mt-5 w-[330px] h-[35px] shadow-[0_4px_4px_rgba(0,0,0,0.25)]">
          Phone:
          <input type="text" name="phone" required minLength={6} />
        </label>
        <button className="mt-12 w-[270px] h-[40px] bg-[#FFA07A] rounded-[20px] text-sm text-white">
          Sign in
        </button>
      </form>

      <div className="flex mt-6 justify-center ">
          <p className="text-xs text-black">You already have an account?</p>
          <Link href="/Login" className="text-xs text-[#FFA07A] pl-2">Login here</Link>
        </div>
    </div>
  );
}

