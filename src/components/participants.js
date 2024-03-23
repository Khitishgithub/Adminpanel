import React, { useEffect, useState } from 'react';
import axios from 'axios';
import * as XLSX from 'xlsx';

const ParticipantList = () => {
    const [eventName, setEventName] = useState('');
    const [participants, setParticipants] = useState([]);
    const [error, setError] = useState('');

    const [eventOptions, setEventOptions] = useState([])

    useEffect(()=>{
        const getData = async ()=>{
            const {data} = await axios.get('https://sxv-backend.onrender.com/api/events/getEvents');
            setEventOptions(data.events);
        }

        getData()
    },[])

    const handleInputChange = (event) => {
        console.log(event.target.value.split('-')[0]);
        setEventName(event.target.value);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const response = await axios.post('https://sxv-backend.onrender.com/api/events/getEv', {
                eventId: eventName
            });
            // const response = await axios.post('http://localhost:8000/api/events/getEv', {
            //     eventId: eventName
            // });
            setParticipants(response.data);
            setError('');
        } catch (err) {
            setError('Error retrieving participants. Please try again later.');
        }
    };

    const downloadExcel = () => {
        const filteredParticipants = participants.map(participant => ({
            name: participant.username,
            email: participant.email,
            college: participant.college,
            graduationYear: participant.graduationYear,
            branch: participant.branch,
            phone: participant.phone,
        }));

        const wb = XLSX.utils.book_new();
        const ws = XLSX.utils.json_to_sheet(filteredParticipants);
        XLSX.utils.book_append_sheet(wb, ws, "Participants");
        XLSX.writeFile(wb, "participants.xlsx");
    };

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <label>
                    Event Name:
                    <select value={eventName} onChange={handleInputChange}>
                        <option value="">Select an event</option>
                        {eventOptions.map((event, index) => (
                            <option key={index} value={event._id}>{event.eventName}       day: {event.day}</option>
                        ))}
                    </select>
                </label>
                <button type="submit">Get Participants</button>
            </form>
            {error && <p>{error}</p>}
            <button onClick={downloadExcel}>Download Excel</button>
            <ul>
                {participants.length > 0 ? (
                    participants.map((participant) => (
                        <li key={participant._id}>{participant.username} {participant.email} {participant.college} {participant.graduationYear} {participant.graduationYear} {participant.branch} {participant.phone}</li>
                    ))
                ) : (
                    <li>No participants</li>
                )}
            </ul>
        </div>
    );
};

export default ParticipantList;
