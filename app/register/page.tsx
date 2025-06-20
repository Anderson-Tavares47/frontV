'use client';

import { useState } from 'react';
import { FaChevronDown } from 'react-icons/fa';
import { registrarSolicitante } from "./action"
import { getToken, parseJwt } from '../../utils/auth'

export default function RegistroPage() {
    const [focused, setFocused] = useState(false);
    const [form, setForm] = useState({
        nome: '',
        cpf: '',
        titulo: '',
        telefone: '',
        email: '',
        cep: '',
        endereco: '',
        numero: '',
        bairro: '',
        zona: '',
        pontoReferencia: '',
        secao: '',
        senha: ''
    });

    const [errors, setErrors] = useState<string[]>([]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async () => {
        const camposObrigatorios = Object.entries(form).filter(([_, valor]) => !valor.trim());
        if (camposObrigatorios.length > 0) {
            const nomesCampos = camposObrigatorios.map(([campo]) => campo);
            setErrors(nomesCampos);
            alert('Preencha todos os campos obrigatórios.');
            return;
        }

        setErrors([]);
        try {
            const token = getToken();

            if (!token) {
                alert('Você precisa estar logado para registrar um solicitante.');
                return;
            }
            const resposta = await registrarSolicitante({
                nomeCompleto: form.nome,
                cpf: form.cpf,
                titulo: form.titulo,
                telefoneContato: form.telefone,
                email: form.email,
                cep: form.cep,
                endereco: form.endereco,
                num: form.numero,
                bairro: form.bairro,
                zona: form.zona,
                pontoReferencia: form.pontoReferencia,
                secaoEleitoral: form.secao,
                senha: form.senha
            }, token);

            window.location.href = "/"
        } catch (err) {
            if (err instanceof Error) {
                alert(`Erro: ${err.message}`);
            } else {
                alert('Erro desconhecido ao salvar solicitante.');
            }
        }
    }

    const isError = (campo: string) => errors.includes(campo);

    return (
        <div className="min-h-screen flex justify-center items-center bg-[#b5e4f1] px-4 py-8">
            <div className="bg-white w-full max-w-4xl p-6 rounded-xl shadow-lg">
                <h2 className="text-xl font-bold text-[#007cb2] border-b border-black pb-1 mb-4">Solicitante</h2>

                <div className="mb-4">
                    <h3 className="font-semibold mb-2">Dados Pessoal</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {[
                            ['*Nome completo:', 'nome'],
                            ['*CPF:', 'cpf'],
                            ['Título de Eleitor:', 'titulo'],
                            ['*Telefone:', 'telefone'],
                            ['*E-mail:', 'email'],
                            ['*Senha:', 'senha']
                        ].map(([label, name]) => (
                            <div key={name}>
                                <label className="text-sm font-medium">{label}</label>
                                <input
                                    type={name === 'senha' ? 'password' : 'text'}
                                    name={name}
                                    value={form[name as keyof typeof form]}
                                    onChange={handleChange}
                                    className={`w-full border ${isError(name) ? 'border-red-500' : 'border-[#007cb2]'
                                        } rounded px-2 py-1 focus:ring-2 focus:ring-[#007cb2] focus:outline-none`}
                                />
                            </div>
                        ))}
                    </div>
                </div>

                <div className="mb-4">
                    <h3 className="font-semibold mb-2">Endereço</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {[
                            ['Cep:', 'cep'],
                            ['Endereço:', 'endereco'],
                            ['Número:', 'numero'],
                            ['Bairro:', 'bairro'],
                            ['Ponto Referência:', 'pontoReferencia'],
                            ['Seção Eleitoral:', 'secao']
                        ].map(([label, name]) => (
                            <div key={name}>
                                <label className="text-sm font-medium">{label}</label>
                                <input
                                    name={name}
                                    value={form[name as keyof typeof form]}
                                    onChange={handleChange}
                                    className={`w-full border ${isError(name) ? 'border-red-500' : 'border-[#007cb2]'
                                        } rounded px-2 py-1 focus:ring-2 focus:ring-[#007cb2] focus:outline-none`}
                                />
                            </div>
                        ))}

                        <div className="relative">
                            <label className="text-sm font-medium">Zona:</label>
                            <select
                                name="zona"
                                value={form.zona}
                                onChange={handleChange}
                                onFocus={() => setFocused(true)}
                                onBlur={() => setFocused(false)}
                                className={`w-full appearance-none border ${isError('zona') ? 'border-red-500' : 'border-[#007cb2]'
                                    } rounded px-2 py-1 pr-10 focus:ring-2 focus:ring-[#007cb2] focus:outline-none`}
                            >
                                <option value="">Selecione</option>
                                <option value="Urbana">Urbana</option>
                                <option value="Rural">Rural</option>
                            </select>

                            <FaChevronDown
                                className={`absolute right-3 top-[35px] text-[#007cb2] pointer-events-none transition-transform duration-200 ${focused || form.zona ? 'rotate-180' : ''
                                    }`}
                                size={14}
                            />
                        </div>
                    </div>
                </div>

                <div className="flex justify-end gap-4">
                    <button
                        onClick={() => window.history.back()}
                        className="bg-gray-100 border border-gray-300 text-gray-800 px-5 py-2 rounded hover:bg-gray-200 transition"
                    >
                        Voltar
                    </button>
                    <button
                        onClick={handleSubmit}
                        className="bg-[#007cb2] text-white px-6 py-2 rounded hover:bg-[#00689c] transition"
                    >
                        Gravar
                    </button>
                </div>
            </div>
        </div>
    );
}
