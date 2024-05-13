const HomePage = () => {
  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <main className="flex flex-1 items-center justify-center">
        <div className="text-center max-w-xl">
          <h2 className="text-4xl font-bold text-gray-800">Welcome to the Admin Panel</h2>
          <p className="mt-4 text-gray-600">
            Manage your eBook collection, monitor user activity, and ensure a seamless
            experience for your readers.
          </p>
          <img
            src="https://images.unsplash.com/photo-1623414686230-2d74a4d73cd5?q=80&w=1930&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            alt="Library management illustration"
            className="mt-8 rounded-lg shadow-lg w-3/4 mx-auto"
          />
        </div>
      </main>
    </div>
  );
};

export default HomePage;
