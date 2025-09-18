
import { useEffect, useState } from "react"
import { MdClose } from "react-icons/md"
import { useSelector } from "react-redux"

export default function ChipInput({
  label,
  name,
  placeholder,
  register,
  errors,
  setValue,
  getValues,
}) {
  const { editCourse, course } = useSelector((state) => state.course)
  const [chips, setChips] = useState([])

  // Initialize chips if editing
  useEffect(() => {
    if (editCourse && course?.tag?.length > 0) {
      setChips(course.tag)
    }
  }, [editCourse, course])

  // Register field and sync chips to form state
  useEffect(() => {
    register(name, {
      required: true,
      validate: () => chips.length > 0,
    })
  }, [register, name, chips])

  useEffect(() => {
    setValue(name, chips)
  }, [chips, name, setValue])

  const handleKeyDown = (event) => {
    if (event.key === "Enter" || event.key === ",") {
      event.preventDefault()
      const chipValue = event.target.value.trim()
      if (chipValue && !chips.includes(chipValue)) {
        setChips((prev) => [...prev, chipValue])
        event.target.value = ""
      }
    }
  }

  const handleDeleteChip = (chipIndex) => {
    setChips((prev) => prev.filter((_, index) => index !== chipIndex))
  }

  return (
    <div className="flex flex-col space-y-2">
      <label className="text-sm text-richblack-5 uppercase tracking-wider" htmlFor={name}>
        {label} <sup className="text-pink-200">*</sup>
      </label>

      <div className="flex w-full flex-wrap gap-y-2">
        {chips.map((chip, index) => (
          <div
            key={index}
            className="m-1 flex items-center rounded-full bg-yellow-400 px-2 py-1 text-sm text-richblack-5"
          >
            {chip}
            <button
              type="button"
              className="ml-2 focus:outline-none"
              onClick={() => handleDeleteChip(index)}
            >
              <MdClose className="text-sm" />
            </button>
          </div>
        ))}

        <input
          id={name}
          name={name}
          type="text"
          placeholder={placeholder}
          onKeyDown={handleKeyDown}
          className="form-style w-full placeholder:uppercase placeholder:tracking-wider placeholder:text-sm"
        />

        {/* Hidden input to ensure form registration */}
        <input type="hidden" value={chips.join(",")} {...register(name)} />
      </div>

      {errors[name] && (
        <span className="ml-2 text-xs tracking-wide text-pink-200">
          {label} is required
        </span>
      )}
    </div>
  )
}
