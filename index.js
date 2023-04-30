const express = require("express");
const mongoose = require("mongoose");
const User = require("./Schemas/User");
const Doctor = require("./Schemas/Doctor");
const Slot = require("./Schemas/Slot");

const app = express();
app.use(express.json());

mongoose
  .connect(
    "mongodb+srv://ilyaberulava:1898@cluster1.k5zmftd.mongodb.net/test",
    { useNewUrlParser: true }
  )
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));

  
app.post("/users", async (req, res) => {
  try {
    const { phone, name } = req.body;
    const user = new User({ phone, name });
    await user.save();
    res.status(201).json(user);
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Server error" });
  }
});

app.post("/doctors", async (req, res) => {
  try {
    const { name, speciality, slots } = req.body;
    const doctor = new Doctor({ name, spec: speciality, slots });
    await doctor.save();
    res.status(201).json(doctor);
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Server error" });
  }
});

app.post("/appointments", async (req, res) => {
  try {
    const { user_id, doctor_id, slot } = req.body;

    // Проверка наличия пользователя и врача в БД
    const user = await User.findById(user_id);
    if (!user) {
      return res.status(400).send("Пользователь не найден");
    }

    const doctor = await Doctor.findById(doctor_id);
    if (!doctor) {
      return res.status(400).send("Доктор не найден");
    }

    // Проверка доступности слота
    if (!doctor.slots.includes(slot)) {
      return res.status(400).send("Запись на это время невозможна");
    }

    // Проверка, что на слот еще никто не записан
    const appointment = await Slot.findOne({ slot: slot });
    if (appointment) {
      return res.status(400).send("Запись на это время занята");
    }

    // Создание новой записи на прием
    const newAppointment = new Slot({
      user_id,
      doctor_id,
      slot,
    });

    await newAppointment.save();

    // Удаление слота у врача
    const updatedSlots = doctor.slots.filter((s) => s !== slot);
    doctor.slots = updatedSlots;
    await doctor.save();

    res.status(201).send("Запись зарегистрирована");
  } catch (error) {
    console.error(error);
    res.status(500).send("Что-то пошло не так(");
  }
});
app.listen(3333, (err) => {
  if (err) {
    console.log("err");
  }
  console.log("ok");
});
