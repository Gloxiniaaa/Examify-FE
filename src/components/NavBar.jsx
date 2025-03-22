const Navbar = () => {
  return (
    <nav className="bg-white shadow-md p-4">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <h1 className="text-2xl font-bold text-primary">Examify</h1>
        <button className="text-neutral-600 hover:text-primary">Logout</button>
      </div>
    </nav>
  );
};

export default Navbar;
