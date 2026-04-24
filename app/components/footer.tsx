export default function Footer() {
  return (
    <div className="flex justify-between bg-gray-200 p-16 ">
      <span className="text-black mx-10">Copyright 2025. Fiate</span>
      <nav className="flex ">
        <ul className="flex text-gray-700">
          <li className="mx-10 text-gray">Privacy Policy</li>
          <li className="mx-10">Terms of Service</li>
          <li className="mx-10">Contact Support</li>
          <li className="mx-10">API Documentation</li>
        </ul>
      </nav>
    </div>
  );
}
