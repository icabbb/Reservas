import { useState } from 'react';
import { useRouter } from 'next/router';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function ResetPassword() {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const router = useRouter();
    const { token } = router.query;

    async function handleSubmit(e: { preventDefault: () => void; }) {
        e.preventDefault();
        if (password !== confirmPassword) {
            alert('Las contraseñas no coinciden.');
            return;
        }

        const response = await fetch('/api/user/changePassToken', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ resetToken: token, newPassword: password }),
        });

        if (response.ok) {
            alert('Tu contraseña ha sido restablecida. Ahora puedes iniciar sesión con tu nueva contraseña.');
            router.push('/login');
        } else {
            alert('No se pudo restablecer tu contraseña. Por favor, intenta de nuevo.');
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
                    </div>
                </CardFooter>
            </Card>
        </div>
    );
}
