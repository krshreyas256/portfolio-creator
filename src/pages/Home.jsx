import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div>
      <h1>Portfolio Creator</h1>

      <p>
        Create your professional portfolio without writing code.
      </p>

      <Link to="/signup">
        Create Your Portfolio
      </Link>

      <br />

      <Link to="/login">
        Login
      </Link>
    </div>
  );
};

export default Home;