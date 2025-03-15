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
  const [currentStep, setCurrentStep] = useState(0);

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
  
  const EmailValidity = (value:string) =>{
      const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
      return !emailRegex.test(value); 
  }

  const NonValide = (currentStep==0 && (user.nom=="" || user.prenom=="") ||
  (currentStep==1 && (user.email=="" || user.motdepasse=="" || user.confirmPassword=="" || EmailValidity(user.email) || (user.motdepasse != user.confirmPassword))                           
));
  
  const nextStep =() =>{
    setCurrentStep(currentStep+1);
  }

  const backStep =() =>{
    setCurrentStep(currentStep-1);
  }
  

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

    const handleAuth = async () => {
      setIsLoading(true);
      setError('');
    
      try {
        let data;
    
        if (isLogin) {
          // Connexion
          data = await userConnection(user.email, user.motdepasse);
          console.log("Connexion réussie:", data);
    
          if (data) {
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
      <div className="mx-auto grid text-white shadow-2xl p-4 px-20  w-3/4 rounded-sm gap-2">
        <div className="grid gap-2 text-center">
          <h1 className="text-xl font-bold">
            {isLogin ? "Se connecter" : "S'inscrire"}
          </h1>
          <p className="text-sm text-zinc-300">
            {isLogin
              ? "Entrez votre email ci-dessous pour vous connecter à votre compte"
              : "Creer un compte pour demarrer "}
          </p>
        </div>
  
        <form   className="grid overflow-y-hidden max-h-[70vh] gap-4">
        {(!isLogin && currentStep==0) &&(
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

         {(currentStep==1 || isLogin)&&
         (
          <>
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
              {/* {isLogin && (
                <Link
                  href="/forgot-password"
                  className="ml-auto text-sm underline"
                >
                  Forgot your password?
                </Link>
              )} */}
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

          {!isLogin&&(<div className="grid gap-2">
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
              {user.motdepasse!=user.confirmPassword &&(<span className="text-red-700">
                Mot de passe different
              </span>)}
            </div>)}

          </>
            )}
  
          {(!isLogin && currentStep==2) && (
            <>
            


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
  
          
        </form>
        {(isLogin || currentStep==2) ? 
          (<div className="flex flex-row gap-8">
            
                       {!isLogin &&( <button
                        onClick={backStep}
                        type="button"
                        className="w-full h-13 cursor-pointer hover:bg-black mt-2 bg-zinc-100 text-black hover:text-white rounded-md"
                      >
                        Retour
                      </button>)}

                       <button
                          type="submit"
                          onClick={handleAuth}
                          className="w-full h-13 cursor-pointer hover:bg-black mt-2 bg-red-800 text-white rounded-md"
                        >
                          {isLogin ? "Se connecter" : "S'inscrire"}
                        </button>  

          </div>
         
        ):(
            <div className="flex flex-row gap-8">
            <button
            disabled={currentStep==0}
                onClick={backStep}
                className={`w-full h-13   mt-2 bg-zinc-100 text-black  rounded-md ${currentStep==0?"opacity-50":"opacity-100 hover:bg-black hover:text-white cursor-pointer"}`}
              >
                Retour
              </button>
            <button
            disabled={NonValide}
            onClick={nextStep}
            className={`w-full h-13   mt-2 bg-zinc-100 text-black  rounded-md ${NonValide?"opacity-50":"opacity-100 hover:bg-black hover:text-white cursor-pointer"}`}
          >
            Suivant
          </button>
          </div>
          )}
        <div className="mb-4 text-center text-sm">
          {isLogin ? "Vous n'avez pas de compte ?" : "Vous avez déjà un compte ?"}{" "}
          <button onClick={toggleAuthMode} className="underline cursor-pointer text-blue-400">
          {isLogin ? "S'inscrire" :  "Se connecter"}
          </button>
        </div> 
      </div>
    );
  };

export default Login