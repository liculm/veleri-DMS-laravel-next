<?php

namespace App\Models\Base;

use Illuminate\Database\Eloquent\Model;

abstract class BaseModel extends Model
{
    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'created_by_id',
        'created_by_name',
    ];
}
