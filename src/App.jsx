import React, { useEffect, useRef, useState } from 'react';
import { setNewOffSet } from './utils/boundary';
import { db } from './apprite/db';

const App = () => {
  const textAreaRefs = useRef([]);
  const cardRefs = useRef([]);
  const [data, setData] = useState([]);
  const [positions, setPositions] = useState([]);
  const [notice, setNotice] = useState(false);
  const [saving, setSaving] = useState(null);

  let mousePosition = { x: 0, y: 0 };
  let currentIndex = null;
  let onKeyUpTimerRef = useRef([])

  const mouseDown = (index) => (e) => {
    currentIndex = index;

    mousePosition.x = e.clientX;
    mousePosition.y = e.clientY;

    document.addEventListener('mousemove', mouseMove);
    document.addEventListener('mouseup', mouseUp);
  };

  const mouseUp = () => {
    document.removeEventListener('mousemove', mouseMove);
    document.removeEventListener('mouseup', mouseUp);
    handleKeyUp("drag");
    currentIndex = null;
  };

  const mouseMove = (e) => {
    if (currentIndex !== null) {
      const mousemoveDir = {
        x: e.clientX - mousePosition.x,
        y: e.clientY - mousePosition.y
      };

      mousePosition.x = e.clientX;
      mousePosition.y = e.clientY;

      const newPositon = setNewOffSet(cardRefs.current[currentIndex], mousemoveDir);

      setPositions((prevPositions) => {
        const updatedPositions = [...prevPositions];
        updatedPositions[currentIndex] = newPositon;
        return updatedPositions;
      });
    }
  };

  const OutGrow = (index) => {
    if (textAreaRefs.current[index]) {
      textAreaRefs.current[index].style.height = "auto";
      textAreaRefs.current[index].style.height = textAreaRefs.current[index].scrollHeight + "px";
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const notes = await db.noteDb.getAll();
        setData(notes.documents); // Accessing documents from the response
        const initialPositions = notes.documents.map((note) => JSON.parse(note.position));
        setPositions(initialPositions);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    data.forEach((_, index) => {
      OutGrow(index);
    });
  }, [data]);

  const handleChange = (index) => (e) => {
    const { value, name } = e.target;
    setData((prevData) => {
      const updatedData = [...prevData];
      updatedData[index][name] = value;
      return updatedData;
    });
  };

  useEffect(() => {
    if (notice) {
      const updateData = async () => {
        for (let i = 0; i < data.length; i++) {
          const response = await db.noteDb.update(data[i].$id, {
            content: data[i].content,
            title: data[i].title,
            position: JSON.stringify(positions[i])
          });
          if (response) {
            console.log("updated", response);
          }
        }
      };

      updateData();
      setNotice(false);
    }
  }, [notice, data, positions]);

  const handleKeyUp = async(ref) => {
    ref === "drag" ? setSaving(currentIndex) : setSaving(currentIndex)

    if(onKeyUpTimerRef.current){
      clearTimeout(onKeyUpTimerRef.current);
    }
    onKeyUpTimerRef.current = setTimeout(() => {
      setNotice(true)
      setSaving(null)
    }, 2000);
  }

  const handleClick = (index) => {
    currentIndex = index;
  
    const cardRef = cardRefs.current[currentIndex];
    if (cardRef) {
      cardRef.style.zIndex = 999;
    }
  
    // Reset zIndex for other cards
    cardRefs.current.forEach((cardRef, i) => {
      if (i !== currentIndex && cardRef) {
        cardRef.style.zIndex = 998; // Or any other value less than 999
      }
    });
  }
  return (
    <div>
      {data.map((item, index) => (
        <div
        onClick={() => handleClick(index)}
          key={item.$id}
          style={{ position: 'absolute', left: positions[index]?.x, top: positions[index]?.y, backgroundColor: item.color }}
          className='card-container'
          ref={(el) => (cardRefs.current[index] = el)}
          onMouseDown={mouseDown(index)}
        >
         <div className='heading'>
         <h2>{item.title}</h2>
         {
          saving === index && <p>Loading...</p>
         }
         </div>
          <textarea
          onKeyUp={() => handleKeyUp("")}
            className='card'
            value={item.content}
            name="content"
            onChange={handleChange(index)}
            ref={(el) => (textAreaRefs.current[index] = el)}
            onInput={() => OutGrow(index)}
            placeholder="Type something..."
          />
        </div>
      ))}
    </div>
  );
};

export default App;
