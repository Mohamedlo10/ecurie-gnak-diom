"use client";
import { userConnection, userInscription } from "@/app/api/utilisateur/query";
import Link from "next/link";
import { useRouter } from 'next/navigation';
import { ChangeEvent, CSSProperties, useEffect, useState } from "react";
import { FiEye, FiEyeOff } from 'react-icons/fi';
import BeatLoader from "react-spinners/BeatLoader";
const override: CSSProperties = {
  display: "block",
  margin: "0 auto",
  borderColor: "red",
};

function Login() {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  let [color, setColor] = useState("#ffffff");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  // const [icon, setIcon] = useState(eyeOff);
  const [type, setType] = useState('password');
  const [user, setUser] = useState({
    prenom: "",
    nom: "",
    email: "",
    motdepasse: "",
    confirmPassword:"",
    role: "",
    ine: "",
  });
  

  const toggleAuthMode = () => {
    setIsLogin(!isLogin);
    setEmail("");
    setPassword("");
  };


  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };


  const handleInputChange = (e : ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value });
  };

 useEffect(() => {
  // Synchronisez les champs avec l'état local lors du montage
  const storedEmail = (document.getElementById('email') as HTMLInputElement)?.value;
  const storedPassword = (document.getElementById('password') as HTMLInputElement)?.value;

  if (storedEmail) setEmail(storedEmail);
  if (storedPassword) setPassword(storedPassword);
}, []);


    const handleNavigation = () => {
      router.push(`/dashboard`);
    };

    const handleAuth = async (e: ChangeEvent<HTMLFormElement>) => {
      e.preventDefault();
      setIsLoading(true);
      setError('');
    
      try {
        let data;
    
        if (isLogin) {
          // Connexion
          data = await userConnection(user.email, user.motdepasse);
          console.log("Connexion réussie:", data);
    
          if (data) {
            localStorage.setItem('role_user', JSON.stringify(data.role));
            localStorage.setItem('user_session', JSON.stringify(data.utilisateur));
            handleNavigation()         
          } 
            else {
            throw new Error(data.message || "Échec de connexion.");
          }
        } else {
          // Inscription
          data = await userInscription(
            user.email,
            user.motdepasse,
            user.nom,
            user.prenom,
            user.role,
            user.ine
          );
          console.log("Réponse du backend après inscription:", data);
    
          if (data) {
            localStorage.setItem('user_session', JSON.stringify(data));
            router.push('/dashboard');
          } else {
            throw new Error(data.message || "Inscription échouée.");
          }
        }
      } catch (err: any) {
        setError(err.message || 'Une erreur est survenue.');
      } finally {
        setIsLoading(false);
      }
    };
    
    
    
    

    
    if (isLoading) {
      return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
          <div className="sweet-loading">
            <BeatLoader
              color={color}
              loading={isLoading}
              cssOverride={override}
              size={15}
              aria-label="Loading Spinner"
              data-testid="loader"
            />
          </div>
        </div>
      );
    }
    
    return (
      <div className="mx-auto grid text-white shadow-2xl h-fit p-4 px-20 w-2/3 rounded-sm gap-2">
        <div className="grid gap-2 text-center">
          <h1 className="text-xl font-bold">
            {isLogin ? "Login" : "Sign Up"}
          </h1>
          <p className="text-sm font-medium">
            {isLogin
              ? "Enter your email below to login to your account"
              : "Create an account to get started"}
          </p>
        </div>
  
        <form onSubmit={handleAuth}  className="grid overflow-y-auto max-h-[80vh] gap-4">
        {!isLogin&&(
          <>
          <div className="grid gap-2">
          <label htmlFor="nom">Nom</label>
          <input
            id="nom"
            name="nom"
            type="text"
            className="bg-white text-black h-13 p-2 rounded-md"
            placeholder="Votre nom"
            value={user.nom}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="grid gap-2">
          <label htmlFor="prenom">Prénom</label>
          <input
            id="prenom"
            name="prenom"
            type="text"
            className="bg-white text-black h-13 p-2 rounded-md"
            placeholder="Votre prénom"
            value={user.prenom}
            onChange={handleInputChange}
            required
          />
        </div>
        </>
        )}

          <div className="grid gap-2">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              className="bg-white text-black h-13 p-2 rounded-md"
              placeholder="m@example.com"
              value={user.email}
              onChange={handleInputChange}
              required
            />
          </div>
  
          <div className="grid gap-2">
            <div className="flex items-center">
              <label htmlFor="password">Password</label>
              {isLogin && (
                <Link
                  href="/forgot-password"
                  className="ml-auto text-sm underline"
                >
                  Forgot your password?
                </Link>
              )}
            </div>
  
            <div className="relative flex items-center">
              <input
                id="motdepasse"
                name="motdepasse"
                className="bg-white h-13 text-black w-full p-2 rounded-md"
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={user.motdepasse}
                onChange={handleInputChange}
                required
              />
              <span
                className="absolute right-3 cursor-pointer text-zinc-500 hover:bg-slate-200 p-1 rounded-full"
                onClick={togglePasswordVisibility}
              >
                {showPassword ? <FiEyeOff size={24} /> : <FiEye size={24} />}
              </span>
            </div>
          </div>
  
          {!isLogin && (
            <>
            
            <div className="grid gap-2">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <div className="relative flex items-center">
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  className="bg-white h-13 w-full text-black p-2 rounded-md"
                  value={user.confirmPassword}
                  onChange={handleInputChange}
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm Password"
                  required
                />
                <span
                  className="absolute right-3 cursor-pointer text-zinc-500 hover:bg-slate-200 p-1 rounded-full"
                  onClick={toggleConfirmPasswordVisibility}
                >
                  {showConfirmPassword ? <FiEyeOff size={24} /> : <FiEye size={24} />}
                </span>
              </div>
            </div>

            <div className="grid gap-2">
              <label htmlFor="role">Role</label>
              <select
                id="role"
                className="bg-white text-black h-13 p-2 rounded-md"
                value={user.role}
                onChange={(e) => setUser({ ...user, role: e.target.value })} 
                required
              >
                <option value="">Sélectionner un rôle</option>
                <option value="etudiant">Étudiant</option>
                <option value="professeur">Professeur</option>
              </select>
            </div>

{user.role==="etudiant"&&(
   <div className="grid gap-2">
   <label htmlFor="ine">INE</label>
   <input
     id="ine"
     type="text"
     name="ine"
     className="bg-white text-black h-13 p-2 rounded-md"
     placeholder="INE"
     value={user.ine}
     onChange={handleInputChange}
     required
   />
 </div>
)

}
           
         

          </>
          )}
  
          <button
            type="submit"
            className="w-full h-13 cursor-pointer hover:bg-black mt-2 bg-red-800 text-white rounded-md"
          >
            {isLogin ? "Login" : "Sign Up"}
          </button>
        </form>
  
        <div className="mb-4 text-center text-sm">
          {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
          <button onClick={toggleAuthMode} className="underline text-blue-400">
            {isLogin ? "Sign up" : "Login"}
          </button>
        </div>
      </div>
    );
  };

export default Login