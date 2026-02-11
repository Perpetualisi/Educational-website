import React from "react";
import msg_icon from "../../assets/msg-icon.png";
import mail_icon from "../../assets/mail-icon.png";
import phone_icon from "../../assets/phone-icon.png";
import location_icon from "../../assets/location-icon.png";
import white_arrow from "../../assets/white-arrow.png";

const Contact = () => {
  const [result, setResult] = React.useState("");

  const onSubmit = async (event) => {
    event.preventDefault();
    setResult("Sending....");
    const formData = new FormData(event.target);

    // Consider moving this to an .env file for security later
    formData.append("access_key", "f03b99d4-599d-460a-998d-62046420b9ba");

    const response = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      body: formData,
    });

    const data = await response.json();

    if (data.success) {
      setResult("Form Submitted Successfully ✅");
      event.target.reset();
    } else {
      console.log("Error", data);
      setResult(data.message);
    }
  };

  return (
    <section className="my-20 mx-auto w-[90%] flex flex-col lg:flex-row justify-between gap-12 lg:gap-20">
      
      {/* LEFT SIDE: Contact Info */}
      <div className="lg:basis-[45%] text-[#676767]">
        <h3 className="text-[#000F38] font-bold text-2xl flex items-center mb-5">
          Send us a message
          <img src={msg_icon} alt="" className="w-8 ml-3" />
        </h3>

        <p className="max-w-[500px] leading-relaxed mb-8">
          Feel free to reach out through the contact form or find our contact
          information below. Your feedback, questions, and suggestions are
          important to us as we strive to provide exceptional service.
        </p>

        <ul className="space-y-6">
          <li className="flex items-center gap-4">
            <img src={mail_icon} alt="" className="w-6" />
            <a href="mailto:Contact@edusity.com" className="hover:text-[#212EA0] transition">Contact@edusity.com</a>
          </li>

          <li className="flex items-center gap-4">
            <img src={phone_icon} alt="" className="w-6" />
            <a href="tel:+11234567890" className="hover:text-[#212EA0] transition">+1 123-456-7890</a>
          </li>

          <li className="flex items-start gap-4">
            <img src={location_icon} alt="" className="w-6 mt-1" />
            <span>
              77 Massachusetts Ave, Cambridge <br />
              MA 02139, United States
            </span>
          </li>
        </ul>
      </div>

      {/* RIGHT SIDE: Form */}
      <div className="lg:basis-[50%]">
        <form onSubmit={onSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block text-gray-700 font-medium mb-1">Your Name</label>
            <input
              type="text"
              name="name"
              placeholder="Enter your name"
              required
              className="w-full bg-[#EBECFE] p-4 rounded-lg outline-none focus:ring-2 focus:ring-[#212EA0] transition"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-1">Phone Number</label>
            <input
              type="tel"
              name="phone"
              placeholder="Enter your mobile number"
              required
              className="w-full bg-[#EBECFE] p-4 rounded-lg outline-none focus:ring-2 focus:ring-[#212EA0] transition"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-1">Write your messages here</label>
            <textarea
              name="message"
              rows="5"
              placeholder="Enter your message"
              required
              className="w-full bg-[#EBECFE] p-4 rounded-lg outline-none focus:ring-2 focus:ring-[#212EA0] resize-none transition"
            ></textarea>
          </div>

          <button
            type="submit"
            className="w-fit flex items-center justify-center gap-3 bg-[#212EA0] text-white px-8 py-3.5 rounded-full font-bold hover:bg-[#1a2580] transition-all active:scale-95"
          >
            Submit now
            <img src={white_arrow} alt="" className="w-4" />
          </button>
        </form>

        <span className={`block mt-4 font-medium ${result.includes('Successfully') ? 'text-green-600' : 'text-gray-600'}`}>
          {result}
        </span>
      </div>
    </section>
  );
};

export default Contact;