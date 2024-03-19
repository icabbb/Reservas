import { useEffect, useState } from "react";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { CardTitle, CardDescription, CardHeader, CardContent, CardFooter, Card } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export default function ChangePassword() {
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const { data: session, status } = useSession();
    const router = useRouter();

    useEffect(() => {
        if (status === "authenticated" && !session?.user.isFirstLogin) {
            if (session?.user.role === "ADMIN") {
                router.push("/dashboard");
            } else {
                router.push("/");
            }
        }
    }, [session, status, router]);

    async function handleSubmit(e: { preventDefault: () => void; }) {
        e.preventDefault();

        if (password !== confirmPassword) {
            console.error("Las contraseñas no coinciden");
            return;
        }

        const response = await fetch("/api/user/changePass", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({
                newPassword: password


            }),
        });

        if (response.ok) {
            console.log("Contraseña cambiada con éxito");

            // Actualiza la sesión del usuario para reflejar que ya no es el primer inicio de sesión
            // Esto es pseudocódigo y dependerá de cómo manejes la sesión y las credenciales
            await signIn('credentials', { rut: session?.user.rut, password: password });

            if (session?.user.role === "ADMIN") {
                router.push("/dashboard");
            } else {
                router.push("/");
            }

        } else {
            console.error("Error al cambiar la contraseña");
            // Muestra un mensaje de error al usuario aquí si es necesario
        }
    }

    function handleBackToLogin() {
        if (session?.user.role === "ADMIN") {
            router.push("/dashboard");
        } else {
            router.push("/");
        }

    }

    return (

        <div className="min-h-screen p-10 flex justify-center items-center">
            <Card >
                <CardHeader className="text-center">
                    <CardTitle className="text-3xl font-bold text-red-500">Cambio de Contraseña</CardTitle>
                    <CardDescription>Ingrese su nueva contraseña y confirme su contraseña a continuación</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="current-password">Nueva Contraseña</Label>
                        <Input id="current-password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="new-password">Confirmar contraseña</Label>
                        <Input id="confirm-password" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
                    </div>

                </CardContent>
                <CardFooter>
                    <div className="flex justify-between flex-row gap-4">
                        <Button variant="destructive" onClick={handleSubmit}>
                            Guardar Cambios
                        </Button>
                        <Button variant="secondary" onClick={handleBackToLogin}>
                            Salir de la pagina de cambio de contraseña
                        </Button>
                    </div>
                </CardFooter>
            </Card>
        </div>


    );
}
