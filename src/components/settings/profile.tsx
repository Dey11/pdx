import React, { useState } from 'react'
import { H3 } from '../typography/h3'
import { Input } from '../ui/input'
import { Button } from '../ui/button'

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  university: string;
  course: string;
  graduatingYear: string;
}

const ProfilePage = () => {
  const [formData, setFormData] = useState<FormData>({
    firstName : "",
    lastName : "",
    email : "",
    university : "",
    course : "",
    graduatingYear : ""
  });
  
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    console.log("Submitting form data for  : ",formData)
  }
  return (
    <div className="my-10 w-full rounded-lg bg-brand-bg flex flex-col sm:flex-row h-auto">
      <div className='flex justify-center w-full sm:w-[25%] py-5 sm:py-16 border-b sm:border-b-0 sm:border-r border-dotted'>
        <div className='flex flex-col items-center gap-3'>
            <div className='w-24 h-24 bg-white rounded-full'></div>
            <button className='bg-black px-3 py-1 rounded-md hover:bg-black/80 transition-colors'>
              <H3 className='text-sm sm:text-xl'>Change avatar</H3>
            </button>
        </div>
      </div>
      <div className='flex flex-col gap-8 px-4 sm:px-12 w-full py-10'>
        <div className='w-full'>
          <H3 className='text-brand-blue text-3xl sm:text-4xl mb-4'>Personal Information</H3>
          <div className='flex flex-col sm:flex-row gap-5 w-full justify-between'>
            <label className="w-full">
              <H3 className='text-lg sm:text-xl mb-2'>First name</H3>
              <Input
                name="firstName"
                placeholder="Enter first name"
                value={formData.firstName}
                className="bg-black/80 border-none"
                onChange={handleChange}
              />
            </label>
            <label className="w-full">
              <H3 className='text-lg sm:text-xl mb-2'>Last name</H3>
              <Input
                name="lastName"
                placeholder="Enter last name"
                value={formData.lastName}
                className="bg-black/80 border-none"
                onChange={handleChange}
              />
            </label>
          </div>
          <label className="w-full block mt-4">
            <H3 className='text-lg sm:text-xl mb-2'>Email</H3>
            <Input
              name="email"
              type="email"
              placeholder="john.doe@example.com"
              value={formData.email}
              className="bg-black/80 border-none"
              onChange={handleChange}
            />
          </label>
        </div>

        <div className='w-full'>
          <H3 className='text-brand-blue text-3xl sm:text-4xl mb-4'>Educational Details</H3>
          <label className="w-full block mb-4">
            <H3 className='text-lg sm:text-xl mb-2'>University/School</H3>
            <Input
              name="university"
              placeholder="University of Edinburgh"
              value={formData.university}
              className="bg-black/80 border-none"
              onChange={handleChange}
            />
          </label>
          <div className='flex flex-col sm:flex-row gap-5 w-full justify-between'>
            <label className="w-full">
              <H3 className='text-lg sm:text-xl mb-2'>Course/Programme</H3>
              <Input
                name="course"
                placeholder="Ex : Computer Science"
                value={formData.course}
                className="bg-black/80 border-none"
                onChange={handleChange}
              />
            </label>
            <label className="w-full">
              <H3 className='text-lg sm:text-xl mb-2'>Graduating Year</H3>
              <Input
                name="graduatingYear"
                placeholder="30.02.2027"
                value={formData.graduatingYear}
                className="bg-black/80 border-none"
                onChange={handleChange}
              />
            </label>
          </div>
        </div>

        <Button
          className="bg-brand-yellow font-medium text-black hover:bg-brand-yellow/80 w-full sm:w-auto sm:self-end"
          onClick={handleSubmit}
        >
          Save Changes
        </Button>
      </div>
    </div>
  )
}

export default ProfilePage
