import { useState, useEffect, } from "react";
import Link from 'next/link'
import { withPageAuthRequired, getSession } from '@auth0/nextjs-auth0';

import { getSupabase } from "../utils/supabase";

import styles from "../styles/Home.module.css";

const defaultFormState = {
  description: "",
  isSuper: false,
};

const Index = ({user, stars}) => {
  const [formData, setFormData] = useState(defaultFormState);
  const [allStars, setAllStars] = useState();

  const handleInputChange = (fieldName, fieldValue) => {
    setFormData({
      ...formData,
      [fieldName]: fieldValue,
    })
  }

  useEffect(() => {
    console.log({
      allStars,
      stars,
    })
    if ( typeof allStars === "undefined" && stars) {
      setAllStars(stars)
    }
  }, [
    allStars,
    stars,
  ])

  const handleSubmit = async (e) => {
    e.preventDefault();

    const supabase = getSupabase(user.accessToken);

    const response = await supabase
      .from("stars")
      .insert({ 
        owner_id: user.sub,
        sub_id: 'bloop',
        // ===
        description: formData.description,
        is_super: formData.isSuper,
      });

    setAllStars([
      ...allStars,
      response.data[0]
    ]);
    setFormData(defaultFormState);
  };

  return (
    <div className={styles.container}>
      <p>
        Welcome {user.name}!{" "}
        <Link href="/api/auth/logout">
          Logout
        </Link>
      </p>

      <form onSubmit={handleSubmit}>
        <input 
          onChange={(e) => handleInputChange("description", e.target.value)} 
          value={formData.description}
        />

        <label htmlFor="isSuper">
          <input 
            type="checkbox" 
            id="isSuper" 
            name="isSuper" 
            checked={formData.isSuper} 
            onChange={(e) => handleInputChange("isSuper", !!e.target.checked)}
          />
          Is this a super star?!
        </label>

        <button>Add</button>
      </form>

      {allStars?.length > 0
        ? allStars.map((star) => (
          <p key={star.id}>{star.is_super && (<strong style={{color: 'orange'}}>***</strong>)}
          {" "}
          {star.description}</p>
        ))
        : (
          <p>You have not yet given out any stars.</p>
        )
      }
    </div>
  )
}

export const getServerSideProps = withPageAuthRequired({
  async getServerSideProps({ req, res }) {
    const {
      user: { accessToken },
    } = await getSession(req, res);

    const supabase = getSupabase(accessToken);

    const { data: stars } = await supabase.from("stars").select("*");

    return {
      props: { stars },
    };
  },
});

export default Index;