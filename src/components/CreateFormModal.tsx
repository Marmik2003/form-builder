/* This example requires Tailwind CSS v2.0+ */
import { navigate } from 'raviger';
import React, { useEffect, useState } from 'react'

import { formData } from '../types/form';

import { authenticateUser, createForm } from '../utils/APIMethods';

export default function CreateForm() {
    const [form, setForm] = useState<formData>({
        id: Number(new Date()),
        name: "",
        description: "",
        formFields: [],
    })

    useEffect(() => {
        authenticateUser();
    }, []);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            const data = await createForm(form);
            navigate(`/form/${data.id}`)
        } catch (error) {
            console.log((error as Error).message);
            alert((error as Error).message);
        }
    }

    return (
        <div className="w-full max-w-lg divide-y divide-gray-200">
            <h2 className="text-2xl my-2 pl-5">Create Form</h2>
            <form onSubmit={handleSubmit} className="p-5">
                <div className="mb-4">
                    <label htmlFor="name">Title</label>
                    <input 
                        id="name"
                        type="text" 
                        name="name"
                        value={form.name}
                        onChange={e => setForm({
                            ...form,
                            name: e.target.value
                        })}
                        className="w-full p-2 my-2 border-2 border-gray-200 rounded-lg"
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="description">Description</label>
                    <input 
                        id="description"
                        type="text" 
                        name="description"
                        value={form.description}
                        onChange={e => setForm({
                            ...form,
                            description: e.target.value
                        })}
                        className="w-full p-2 my-2 border-2 border-gray-200 rounded-lg"
                    />
                </div>
                <button type="submit" className="w-full py-2 rounded-lg bg-blue-500 text-lg text-white font-semibold hover:bg-blue-600 hover:shadow-lg">Create</button>

            </form>
        </div>
    )
}

