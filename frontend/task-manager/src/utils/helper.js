export const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
};

export const validateSignupForm=({name,email,password,confirmPassword})=>{
    if(!name||!email||!password||!confirmPassword){
        return "All fields are required";
    }

    if(!validateEmail(email)){
        return "Please enter valid email";
    }

    if(password.length<8){
        return "Password must be 8 characters";
    }

    if(password !== confirmPassword){
        return "Password doesn't match";
    }

    return null;
};

export const addThousandsSeparator = (num)=>{
    if(num == null || isNaN(num)) return "";

    const [integerPart,fractionalPart]=num.toString().split(".");
    const formattedInteger=integerPart.replace(/\B(?=(\d{3})+(?!\d))/g,",");

    return fractionalPart ? `${formattedInteger}.${fractionalPart}`
    : formattedInteger;
};