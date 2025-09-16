const RegisterPage = () => {
  return (
    <div className="flex flex-col items-center bg-gray-800 p-12 w-1/3 h-full justify-center rounded">
      <div className="shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-8">Registrace</h2>
        <form className="mb-6">
          <div>
            <label className="block mb-2">Uživatelské jméno</label>
            <input
              type="text"
              className="w-full p-2 border border-gray-300 rounded bg-gray-800 text-white"
            />
          </div>
          <div className="mt-4">
            <label className="block mb-2">Jméno</label>
            <input
              type="text"
              className="w-full p-2 border border-gray-300 rounded bg-gray-800 text-white"
            />
          </div>
          <div className="mt-4">
            <label className="block mb-2">Příjmení</label>
            <input
              type="text"
              className="w-full p-2 border border-gray-300 rounded bg-gray-800 text-white"
            />
          </div>
          <div className="mt-4">
            <label className="block mb-2">Email</label>
            <input
              type="email"
              className="w-full p-2 border border-gray-300 rounded bg-gray-800 text-white"
            />
          </div>
          <div className="mt-4">
            <label className="block mb-2">Heslo</label>
            <input
              type="password"
              className="w-full p-2 border border-gray-300 rounded bg-gray-800 text-white"
            />
          </div>
        </form>
        <button className="w-full bg-white text-gray-800 font-semibold py-2 px-4 rounded hover:bg-primary-dark mt-4">
          Přihlásit se
        </button>
      </div>
    </div>
  );
};

export default RegisterPage;
