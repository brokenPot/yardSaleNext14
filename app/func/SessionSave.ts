import getSession from "@/lib/session";

export  const SessionSave = async (userdata:any)=>{
    const session = await getSession();
    session.id = userdata.id;
    await session.save();
}